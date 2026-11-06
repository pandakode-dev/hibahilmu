"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  Sparkles,
  Printer,
  RotateCcw,
  CheckCircle2,
  Compass,
  GraduationCap,
  Baby,
  Eraser,
  Paintbrush,
  Award,
  BookOpen,
  Music,
  Dumbbell,
  Cpu,
  HeartHandshake,
  Lock,
} from "lucide-react";

// ============================================================================
// 1. DATA TES VISUAL ANAK USIA 4–8 TAHUN (TK & SD AWAL)
// ============================================================================
const KARTU_VISUAL_ANAK = [
  {
    id: 1,
    pertanyaan: "Kalau sedang waktu bermain bebas, kamu paling suka melakukan apa?",
    opsi: [
      { kode: "seni", ikon: "🎨", teks: "Menggambar, Mewarnai & Membuat Prakarya" },
      { kode: "fisik", ikon: "⚽", teks: "Berlari, Main Bola, Bersepeda & Olahraga" },
      { kode: "logika", ikon: "🧩", teks: "Menyusun Balok Lego, Puzzle & Robot" },
      { kode: "sosial", ikon: "👫", teks: "Bermain Peran & Ngobrol Bareng Teman" },
    ],
  },
  {
    id: 2,
    pertanyaan: "Hadiah ulang tahun apa yang paling membuatmu melompat kegirangan?",
    opsi: [
      { kode: "musik", ikon: "🎹", teks: "Alat Musik (Piano Mini, Gitar, Drum)" },
      { kode: "alam", ikon: "🐾", teks: "Hewan Peliharaan, Tanaman & Kaca Pembesar" },
      { kode: "bahasa", ikon: "📚", teks: "Buku Cerita Bergambar & Mikrofon Bercerita" },
      { kode: "logika", ikon: "🤖", teks: "Mainan Sains, Eksperimen & Tablet Game Logika" },
    ],
  },
  {
    id: 3,
    pertanyaan: "Saat diajak jalan-jalan akhir pekan, tempat mana yang paling seru?",
    opsi: [
      { kode: "fisik", ikon: "🏊", teks: "Kolam Renang, Taman Bermain & Outbound" },
      { kode: "alam", ikon: "🦁", teks: "Kebun Binatang, Pantai & Taman Bunga" },
      { kode: "seni", ikon: "🎭", teks: "Pameran Lukisan, Menonton Pentas & Studio Foto" },
      { kode: "sosial", ikon: "🏠", teks: "Mengunjungi Rumah Saudara & Bermain Rame-Rame" },
    ],
  },
  {
    id: 4,
    pertanyaan: "Kalau ada mainan baru di depanmu, apa yang langsung kamu lakukan?",
    opsi: [
      { kode: "logika", ikon: "🔧", teks: "Membongkar & Mencari Tahu Cara Kerjanya" },
      { kode: "seni", ikon: "✨", teks: "Menghiasinya dengan Stiker & Warna-Warni" },
      { kode: "sosial", ikon: "🎁", teks: "Mengajak Teman-Teman Ikut Mencobanya Bersama" },
      { kode: "bahasa", ikon: "🗣️", teks: "Membuat Cerita Seru tentang Mainan Itu" },
    ],
  },
  {
    id: 5,
    pertanyaan: "Pelajaran atau kegiatan apa di sekolah yang paling kamu tunggu-tunggu?",
    opsi: [
      { kode: "musik", ikon: "🎵", teks: "Menyanyi, Menari & Bermain Musik" },
      { kode: "fisik", ikon: "🏃", teks: "Olahraga, Senam & Permainan Lapangan" },
      { kode: "logika", ikon: "🔢", teks: "Berhitung Cepat & Teka-Teki Pintar" },
      { kode: "bahasa", ikon: "📖", teks: "Mendengarkan Dongeng & Maju Bercerita" },
    ],
  },
  {
    id: 6,
    pertanyaan: "Saat melihat temanmu sedang sedih di kelas, apa yang kamu lakukan?",
    opsi: [
      { kode: "sosial", ikon: "🤗", teks: "Memeluk, Menghibur & Membagi Bekal Makanan" },
      { kode: "seni", ikon: "🖍️", teks: "Membuatkan Gambar Lucu Supaya Dia Tersenyum" },
      { kode: "bahasa", ikon: "💬", teks: "Mengajaknya Mengobrol & Mendengarkan Ceritanya" },
      { kode: "alam", ikon: "🌸", teks: "Mengajaknya Duduk di Taman Melihat Kupu-Kupu" },
    ],
  },
];

const OBSERVASI_ORTU_ANAK = [
  { id: "o1", kategori: "fisik", label: "Anak sangat aktif bergerak, lincah berlari/memanjat, dan tidak mudah lelah secara fisik." },
  { id: "o2", kategori: "seni", label: "Anak gemar mencoret-coret, memadukan warna, menggambar bentuk imajinatif, atau merakit kerajinan." },
  { id: "o3", kategori: "musik", label: "Anak cepat menghafal nada lagu, suka bersenandung, atau mengetuk-ngetuk mengikuti irama musik." },
  { id: "o4", kategori: "logika", label: "Anak suka bertanya 'mengapa/bagaimana', menyukai angka, puzzle, lego, atau eksperimen sains." },
  { id: "o5", kategori: "bahasa", label: "Anak kosakatanya kaya, pandai merangkai cerita panjang, dan berani tampil bicara." },
  { id: "o6", kategori: "sosial", label: "Anak mudah bergaul, suka memimpin permainan teman sebaya, dan peka menolong teman." },
  { id: "o7", kategori: "alam", label: "Anak sangat menyukai hewan, tanaman, bermain di alam terbuka, dan mengamati lingkungan." },
  { id: "o8", kategori: "mandiri", label: "Anak punya kemauan kuat, fokus saat mengerjakan hobi sendiri, dan tahu apa yang ia inginkan." },
];

const DETAIL_DIMENSI_ANAK: Record<
  string,
  {
    nama: string;
    ikon: string;
    warna: string;
    rekomendasiLes: string[];
    kegiatanRumah: string;
    potensiMasaDepan: string;
  }
> = {
  seni: {
    nama: "Kecerdasan Visual-Spasial & Seni Kreatif",
    ikon: "🎨",
    warna: "#e11d48",
    rekomendasiLes: ["Les Menggambar & Melukis Kanvas", "Kelas Clay / Origami & Kerajinan Tangan", "Desain & Animasi Anak (Scratch Jr)"],
    kegiatanRumah: "Sediakan buku gambar besar, cat air aman, plastisin, dan pajang hasil karyanya di dinding rumah.",
    potensiMasaDepan: "Arsitek, Desainer Produk/Visual, Animator, Direktur Kreatif, Seniman Digital.",
  },
  fisik: {
    nama: "Kecerdasan Kinestetik-Jasmani & Motorik Fisik",
    ikon: "⚽",
    warna: "#ea580c",
    rekomendasiLes: ["Les Renang / Akuatik", "Sekolah Sepak Bola (SSB) / Futsal / Badminton", "Bela Diri (Taekwondo / Karate / Pencak Silat) atau Senam Gimnastik"],
    kegiatanRumah: "Ajak bermain di luar ruangan minimal 45 menit sehari untuk menyalurkan energi kinestetiknya.",
    potensiMasaDepan: "Atlet Profesional, Dokter Bedah/Fisioterapis, Instruktur Kebugaran, Engineer Lapangan.",
  },
  logika: {
    nama: "Kecerdasan Logika-Matematika & Sains",
    ikon: "🧩",
    warna: "#2563eb",
    rekomendasiLes: ["Les Robotika & Coding Anak", "Kursus Sempoa / Matematika Logika Gasing", "Klub Sains & Eksperimen Cilik / Catur"],
    kegiatanRumah: "Berikan mainan balok konstruksi (Lego), puzzle bertingkat, dan buku ensiklopedia bergambar.",
    potensiMasaDepan: "Ilmuwan Data/AI, Programmer, Dokter, Insinyur Teknik, Analis Keuangan.",
  },
  musik: {
    nama: "Kecerdasan Musikal & Irama Auditori",
    ikon: "🎹",
    warna: "#9333ea",
    rekomendasiLes: ["Les Piano / Keyboard Dasar", "Kelas Vokal / Paduan Suara Anak", "Les Biola / Gitar Akustik / Perkusi Drum"],
    kegiatanRumah: "Putarkan musik instrumen yang variatif dan dukung anak belajar menghafal lewat lagu/irama.",
    potensiMasaDepan: "Komposer Musik, Sound Engineer, Pendidik Seni, Kreator Audio-Visual.",
  },
  bahasa: {
    nama: "Kecerdasan Linguistik-Verbal & Bercerita",
    ikon: "📚",
    warna: "#059669",
    rekomendasiLes: ["Les Bahasa Inggris / Bahasa Arab / Mandarin", "Kelas Storytelling (Mendongeng) & Public Speaking Cilik", "Klub Membaca & Menulis Cerita Anak"],
    kegiatanRumah: "Bacakan buku cerita sebelum tidur dan minta anak menceritakan kembali dengan bahasanya sendiri.",
    potensiMasaDepan: "Penulis, Jurnalis, Diplomat, Pengacara, Dosen/Pendidik, Content Presenter.",
  },
  sosial: {
    nama: "Kecerdasan Interpersonal, Kepemimpinan & Empati",
    ikon: "🤝",
    warna: "#0284c7",
    rekomendasiLes: ["Pramuka Siaga / Klub Kepanduan", "Kelas Teater & Drama Musikal Anak", "Olahraga Beregu (Basket / Futsal)"],
    kegiatanRumah: "Berikan peran tanggung jawab kecil di keluarga dan ajak berbagi di kegiatan sosial.",
    potensiMasaDepan: "Pemimpin Organisasi, Psikolog, HR Specialist, Dokter Anak, Entrepreneur.",
  },
  alam: {
    nama: "Kecerdasan Naturalis, Lingkungan & Flora-Fauna",
    ikon: "🌿",
    warna: "#16a34a",
    rekomendasiLes: ["Klub Pecinta Alam & Berkebun Anak", "Kelas Sains Alam & Observasi Satwa", "Kegiatan Berkuda / Memanah Outdoor"],
    kegiatanRumah: "Ajak merawat tanaman di pot sendiri atau memelihara ikan/hewan kesayangan di rumah.",
    potensiMasaDepan: "Dokter Hewan, Ahli Bioteknologi, Pakar Konservasi Lingkungan, Agonom.",
  },
};

// ============================================================================
// 2. DATA TES EKSPLORASI SMP & SD ATAS (9–15 TAHUN: GAYA BELAJAR VAK + MINAT)
// ============================================================================
const SOAL_SMP_EKSPLORASI = [
  { no: 1, kategori: "visual", klaster: "Sains & Teknologi", teks: "Saya lebih cepat paham pelajaran kalau melihat gambar diagram, peta warna, atau video animasi." },
  { no: 2, kategori: "auditori", klaster: "Sosial & Bahasa", teks: "Saya mudah mengingat materi pelajaran saat mendengarkan penjelasan guru atau berdiskusi keras dengan teman." },
  { no: 3, kategori: "kinestetik", klaster: "Olahraga & Praktik", teks: "Saya paling suka belajar dengan cara langsung praktik di laboratorium, bengkel, atau bergerak di lapangan." },
  { no: 4, kategori: "visual", klaster: "Seni & Desain Digital", teks: "Saya senang mendesain poster, mengedit video, menggambar ilustrasi, atau merapikan catatan dengan stabilo warna-warni." },
  { no: 5, kategori: "auditori", klaster: "Kepemimpinan & Komunikasi", teks: "Saya berani maju mempresentasikan tugas kelompok dan senang menjadi juru bicara di depan kelas." },
  { no: 6, kategori: "kinestetik", klaster: "Sains & Teknologi", teks: "Saya hobi mengutak-atik komputer, merakit rangkaian elektronik/robot, atau mencoba membuat kode game." },
  { no: 7, kategori: "auditori", klaster: "Seni & Desain Digital", teks: "Belajar sambil mendengarkan musik atau membuat lagu/podcast membuat saya sangat bersemangat." },
  { no: 8, kategori: "visual", klaster: "Bisnis & Organisasi", teks: "Saya suka merencanakan target kegiatan, mengatur keuangan tabungan, dan membuat tabel jadwal yang rapi." },
  { no: 9, kategori: "kinestetik", klaster: "Olahraga & Praktik", teks: "Mengikuti lomba olahraga, pramuka, atau kegiatan fisik di luar ruangan selalu menjadi favorit saya." },
  { no: 10, kategori: "auditori", klaster: "Sosial & Bahasa", teks: "Saya senang mempelajari bahasa asing dan membantu mengajari teman yang kesulitan memahami pelajaran." },
  { no: 11, kategori: "visual", klaster: "Sains & Teknologi", teks: "Saya tertantang memecahkan soal teka-teki logika, matematika, dan menganalisis data eksperimen." },
  { no: 12, kategori: "kinestetik", klaster: "Bisnis & Organisasi", teks: "Saya senang terlibat langsung menjadi panitia acara sekolah, bazar kewirausahaan, atau kegiatan OSIS." },
];

// ============================================================================
// 3. DATA TES PENJURUSAN SMA / SMK (15–18 TAHUN: RIASEC HOLLAND + KULIAH)
// ============================================================================
const SOAL_SMA_RIASEC = [
  { no: 1, tipe: "R", namaTipe: "Realistic (Teknik, Mesin & Lapangan)", teks: "Saya menyukai pekerjaan yang menggunakan peralatan teknis, mesin, perangkat keras IoT, atau konstruksi nyata." },
  { no: 2, tipe: "I", namaTipe: "Investigative (Sains, Riset, IT & Medis)", teks: "Saya senang meneliti fenomena ilmiah, menulis kode algoritma pemrograman, atau mendiagnosa masalah medis/data." },
  { no: 3, tipe: "A", namaTipe: "Artistic (Kreatif, Desain, Arsitektur & Media)", teks: "Saya menikmati kebebasan berkreasi menciptakan desain UI/UX, karya seni visual, arsitektur, musik, atau tulisan kreatif." },
  { no: 4, tipe: "S", namaTipe: "Social (Edukasi, Psikologi, HR & Kesehatan)", teks: "Saya merasa bermakna saat mengajar, memberikan konseling psikologi, merawat pasien, atau memberdayakan masyarakat." },
  { no: 5, tipe: "E", namaTipe: "Enterprising (Bisnis, Manajemen, Hukum & Politik)", teks: "Saya tertantang memimpin organisasi, membangun bisnis startup, bernegosiasi, dan mengelola strategi pemasaran." },
  { no: 6, tipe: "C", namaTipe: "Conventional (Akuntansi, Data, Perbankan & Administrasi)", teks: "Saya teliti dalam mengelola pembukuan keuangan, mengaudit anggaran, menyusun database, dan menjaga kepatuhan aturan." },
  { no: 7, tipe: "R", namaTipe: "Realistic (Teknik, Mesin & Lapangan)", teks: "Saya lebih memilih bekerja praktik di laboratorium/lapangan daripada hanya duduk di balik meja sepanjang hari." },
  { no: 8, tipe: "I", namaTipe: "Investigative (Sains, Riset, IT & Medis)", teks: "Saya suka membaca jurnal sains/teknologi dan memecahkan persoalan matematika, fisika, biologi, atau logika komputer." },
  { no: 9, tipe: "A", namaTipe: "Artistic (Kreatif, Desain, Arsitektur & Media)", teks: "Saya punya imajinasi orisinal dan tidak suka pekerjaan yang terlalu kaku atau monoton berulang-ulang." },
  { no: 10, tipe: "S", namaTipe: "Social (Edukasi, Psikologi, HR & Kesehatan)", teks: "Teman-teman sering meminta saran saya karena saya sabar mendengarkan dan mudah berempati." },
  { no: 11, tipe: "E", namaTipe: "Enterprising (Bisnis, Manajemen, Hukum & Politik)", teks: "Saya berani mengambil risiko terukur dan pandai meyakinkan orang lain untuk mendukung proyek yang saya gagas." },
  { no: 12, tipe: "C", namaTipe: "Conventional (Akuntansi, Data, Perbankan & Administrasi)", teks: "Saya sangat rapi menyusun dokumen, jadwal, rumus spreadsheet Excel, dan memastikan tidak ada kesalahan angka." },
];

const REKOMENDASI_RIASEC_SMA: Record<
  string,
  {
    judul: string;
    mapelPilihanKurikulumMerdeka: string[];
    jurusanKuliahSaintekSoshum: string[];
    karierMasaDepan: string[];
  }
> = {
  I: {
    judul: "Investigative — Pemikir Sains, Teknologi, Riset & Medis",
    mapelPilihanKurikulumMerdeka: ["Informatika / Koding", "Matematika Tingkat Lanjut", "Fisika / Biologi / Kimia"],
    jurusanKuliahSaintekSoshum: ["Teknik Informatika / Ilmu Komputer & AI", "Kedokteran / Farmasi / Biomedis", "Sains Data & Statistika", "Teknik Elektro & Robotika"],
    karierMasaDepan: ["AI & Software Engineer", "Data Scientist", "Dokter Spesialis / Peneliti Medis", "Cybersecurity Analyst"],
  },
  A: {
    judul: "Artistic — Kreator Desain, Arsitektur, Media & Inovasi",
    mapelPilihanKurikulumMerdeka: ["Seni Rupa / Desain", "Informatika Multimedia", "Bahasa Inggris Lanjut & Sastra"],
    jurusanKuliahSaintekSoshum: ["Desain Komunikasi Visual (DKV)", "Arsitektur & Desain Interior", "Ilmu Komunikasi & Film/Animasi", "Desain Produk Industri"],
    karierMasaDepan: ["UI/UX Product Designer", "Arsitek", "Creative Director & Animator", "Digital Content Strategist"],
  },
  S: {
    judul: "Social — Pendidik, Psikolog, HRBP & Pengabdi Masyarakat",
    mapelPilihanKurikulumMerdeka: ["Sosiologi", "Biologi / Kesehatan", "Bahasa Indonesia & Bahasa Asing"],
    jurusanKuliahSaintekSoshum: ["Psikologi", "Manajemen SDM & Organisasi", "Pendidikan / Keguruan & EdTech", "Kesehatan Masyarakat & Keperawatan"],
    karierMasaDepan: ["HR Business Partner & People Development", "Psikolog / Konselor", "Dosen / Pendidik Inovatif", "Diplomat & Pekerja Sosial"],
  },
  E: {
    judul: "Enterprising — Pemimpin Bisnis, Entrepreneur, Hukum & Strategi",
    mapelPilihanKurikulumMerdeka: ["Ekonomi & Kewirausahaan", "Sosiologi / PPKn", "Matematika & Bahasa Inggris"],
    jurusanKuliahSaintekSoshum: ["Manajemen Bisnis & Kewirausahaan", "Ilmu Hukum", "Hubungan Internasional", "Bisnis Digital & Pemasaran"],
    karierMasaDepan: ["Startup Founder / CEO", "Product & Marketing Manager", "Konsultan Bisnis & Hukum", "Project Director"],
  },
  R: {
    judul: "Realistic — Insinyur Praktis, Otomotif, IoT & Agroteknologi",
    mapelPilihanKurikulumMerdeka: ["Fisika Terapan", "Informatika & Elektronika", "Biologi / Prakarya Rekayasa"],
    jurusanKuliahSaintekSoshum: ["Teknik Mesin / Otomotif / Dirgantara", "Teknik Sipil & Konstruksi", "Teknik Elektro & Instrumentasi IoT", "Agroteknologi & Kehutanan"],
    karierMasaDepan: ["IoT & Embedded System Engineer", "Civil & Mechanical Engineer", "Pilot / Teknisi Aviasi", "Smart Farming Specialist"],
  },
  C: {
    judul: "Conventional — Ahli Keuangan, Akuntansi, Audit & Tata Kelola Data",
    mapelPilihanKurikulumMerdeka: ["Ekonomi & Akuntansi", "Matematika", "Informatika Pengolahan Data"],
    jurusanKuliahSaintekSoshum: ["Akuntansi & Perpajakan", "Perbankan & Keuangan Syariah/Umum", "Aktuaria & Statistika Terapan", "Administrasi Bisnis/Publik"],
    karierMasaDepan: ["Financial Auditor & CFO", "Actuary (Aktuaris)", "Database & Compliance Administrator", "Treasury Specialist"],
  },
};

export const MultiJenjangTalentSuite: React.FC<{
  modeJenjang: "anak_tk_sd" | "smp" | "sma";
  namaPeserta: string;
  setNamaPeserta: (v: string) => void;
  instansiPeserta: string;
  setInstansiPeserta: (v: string) => void;
  onSimpanHasilKeCloud?: (paketLaporan: any) => void;
}> = ({
  modeJenjang,
  namaPeserta,
  setNamaPeserta,
  instansiPeserta,
  setInstansiPeserta,
  onSimpanHasilKeCloud,
}) => {
  // ==========================================================================
  // STATE KHUSUS MODE ANAK (4–8 TAHUN): KANVAS GAMBAR/WARNA + KARTU VISUAL
  // ==========================================================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sedangMenggambar, setSedangMenggambar] = useState<boolean>(false);
  const [warnaKuas, setWarnaKuas] = useState<string>("#e11d48");
  const [ukuranKuas, setUkuranKuas] = useState<number>(10);
  const [templateGambarAnak, setTemplateGambarAnak] = useState<
    "rumah_pohon" | "robot_bintang" | "bebas"
  >("rumah_pohon");

  // Metrik Telemetri Kanvas Gambar Anak (Dianalisis oleh Algoritma Psikometri Anak)
  const [warnaTerpakaiSet, setWarnaTerpakaiSet] = useState<Set<string>>(
    new Set(["#e11d48"])
  );
  const [jumlahGoresan, setJumlahGoresan] = useState<number>(0);
  const [totalPanjangGoresan, setTotalPanjangGoresan] = useState<number>(0);
  const [jawabanKartuAnak, setJawabanKartuAnak] = useState<Record<number, string>>({});
  const [observasiOrtu, setObservasiOrtu] = useState<Record<string, boolean>>({});
  const [tampilkanHasilAnak, setTampilkanHasilAnak] = useState<boolean>(false);

  // ==========================================================================
  // STATE KHUSUS MODE SMP (9–15 TAHUN) & SMA (15–18 TAHUN) — AWAL 100% KOSONG!
  // ==========================================================================
  const [jawabanSmp, setJawabanSmp] = useState<Record<number, number>>({});
  const [tampilkanHasilSmp, setTampilkanHasilSmp] = useState<boolean>(false);

  const [jawabanSma, setJawabanSma] = useState<Record<number, number>>({});
  const [tampilkanHasilSma, setTampilkanHasilSma] = useState<boolean>(false);

  // Inisialisasi Kanvas Mewarnai Anak dengan Outline Gambar
  const gambarOutlineTemplateDiKanvas = (
    tipe: "rumah_pohon" | "robot_bintang" | "bebas"
  ) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;

    if (tipe === "rumah_pohon") {
      // Matahari
      ctx.beginPath();
      ctx.arc(70, 55, 28, 0, Math.PI * 2);
      ctx.stroke();
      // Atap Rumah Segitiga
      ctx.beginPath();
      ctx.moveTo(150, 110);
      ctx.lineTo(230, 45);
      ctx.lineTo(310, 110);
      ctx.closePath();
      ctx.stroke();
      // Dinding Rumah & Pintu
      ctx.strokeRect(170, 110, 120, 100);
      ctx.strokeRect(215, 150, 32, 60);
      // Pohon Rindang di Kanan
      ctx.strokeRect(410, 130, 24, 80);
      ctx.beginPath();
      ctx.arc(422, 95, 45, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tipe === "robot_bintang") {
      // Kepala & Antena Robot
      ctx.strokeRect(205, 45, 90, 65);
      ctx.beginPath();
      ctx.arc(230, 75, 10, 0, Math.PI * 2);
      ctx.arc(270, 75, 10, 0, Math.PI * 2);
      ctx.stroke();
      // Badan & Tangan Robot
      ctx.strokeRect(185, 118, 130, 95);
      ctx.strokeRect(145, 125, 35, 70);
      ctx.strokeRect(320, 125, 35, 70);
      // Roket / Bintang di Kiri
      ctx.beginPath();
      ctx.arc(85, 80, 26, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (modeJenjang === "anak_tk_sd") {
      setTimeout(() => gambarOutlineTemplateDiKanvas(templateGambarAnak), 80);
    }
  }, [modeJenjang, templateGambarAnak]);

  const mulaiGoresKanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (cvs.width / rect.width);
    const y = (e.clientY - rect.top) * (cvs.height / rect.height);
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    setSedangMenggambar(true);
    setJumlahGoresan((g) => g + 1);
    setWarnaTerpakaiSet((prev) => new Set(prev).add(warnaKuas));

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const lanjutkanGoresKanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!sedangMenggambar) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (cvs.width / rect.width);
    const y = (e.clientY - rect.top) * (cvs.height / rect.height);
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = warnaKuas;
    ctx.lineWidth = ukuranKuas;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setTotalPanjangGoresan((p) => p + 1);
  };

  // ==========================================================================
  // ALGORITMA PENILAIAN KHUSUS ANAK 4–8 TAHUN (GAMBAR + KARTU VISUAL + ORTU)
  // ==========================================================================
  const hitungHasilBakatAnak = () => {
    const skor: Record<string, number> = {
      seni: 35,
      fisik: 35,
      logika: 35,
      musik: 35,
      bahasa: 35,
      sosial: 35,
      alam: 35,
    };

    // 1. Analisis Telemetri Kanvas Mewarnai & Menggambar Anak
    const variasiWarna = warnaTerpakaiSet.size;
    skor.seni += Math.min(35, variasiWarna * 6 + Math.min(20, jumlahGoresan * 1.5));
    if (totalPanjangGoresan > 120) skor.fisik += 15; // Motorik halus & stamina gerak tangan aktif
    if (templateGambarAnak === "robot_bintang") skor.logika += 14;
    if (templateGambarAnak === "rumah_pohon") skor.alam += 14;

    // 2. Analisis Pilihan 6 Kartu Bergambar
    Object.values(jawabanKartuAnak).forEach((kode) => {
      if (skor[kode] !== undefined) skor[kode] += 18;
    });

    // 3. Analisis Checklist Observasi Orang Tua
    OBSERVASI_ORTU_ANAK.forEach((item) => {
      if (observasiOrtu[item.id] && skor[item.kategori] !== undefined) {
        skor[item.kategori] += 20;
      }
    });

    const daftarUrut = Object.entries(skor)
      .map(([kode, nilai]) => ({
        kode,
        persen: Math.min(99, Math.round(nilai)),
        info: DETAIL_DIMENSI_ANAK[kode],
      }))
      .filter((x) => x.info)
      .sort((a, b) => b.persen - a.persen);

    return {
      daftarUrut,
      top3: daftarUrut.slice(0, 3),
      variasiWarna,
      jumlahGoresan,
    };
  };

  // ==========================================================================
  // RENDER 1: STUDIO TALENT MAPPING ANAK USIA DINI (4–8 TAHUN / TK & SD AWAL)
  // ==========================================================================
  if (modeJenjang === "anak_tk_sd") {
    const hasilAnak = hitungHasilBakatAnak();

    return (
      <div className="space-y-8">
        <div className="print:hidden bg-gradient-to-r from-pink-600 via-amber-500 to-emerald-600 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white text-pink-700 font-black text-xs uppercase">
              👶 Khusus Anak Usia 4–8 Tahun (PAUD / TK / SD Kelas 1–2)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Tes Bakat Anak Tanpa Soal Teks: Mewarnai, Pilih Gambar &amp; Observasi
            </h2>
            <p className="text-xs sm:text-sm text-white/95">
              Anak cukup mewarnai/menggambar di kanvas dan memilih gambar kesukaannya. Sistem otomatis menganalisis motorik, kreativitas warna, dan merekomendasikan <strong>Les / Kursus &amp; Kegiatan</strong> paling tepat!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTampilkanHasilAnak(true)}
              className="px-5 py-3 rounded-2xl bg-slate-950 text-amber-300 font-black text-xs sm:text-sm cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 inline mr-1" /> Lihat Hasil &amp; Rekomendasi Les Anak
            </button>
          </div>
        </div>

        {/* Input Nama Anak & Usia */}
        <div className="print:hidden bg-white p-5 rounded-3xl border-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="font-black text-slate-700">Nama Lengkap Anak:</label>
            <input
              type="text"
              placeholder="Contoh: Ananda Zahra / Raffi (6 Tahun)"
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border-2 border-slate-200 font-bold"
            />
          </div>
          <div>
            <label className="font-black text-slate-700">Usia / Sekolah TK-SD:</label>
            <input
              type="text"
              placeholder="Contoh: Usia 6 Tahun - TK B / SD Kelas 1"
              value={instansiPeserta}
              onChange={(e) => setInstansiPeserta(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border-2 border-slate-200 font-bold"
            />
          </div>
        </div>

        {/* LANGKAH 1: KANVAS MEWARNAI & MENGGAMBAR INTERAKTIF ANAK */}
        <div className="print:hidden bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-lg space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
            <div>
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                Langkah 1 • Aktivitas Sensorik &amp; Ekspresi Visual Anak
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                🎨 Kanvas Mewarnai &amp; Menggambar Bebas (Ajak Anak Mewarnai Gambar Ini!)
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: "rumah_pohon", label: "🏡 Mewarnai Rumah & Pohon" },
                { id: "robot_bintang", label: "🤖 Mewarnai Robot & Bintang" },
                { id: "bebas", label: "✨ Kanvas Kosong (Gambar Bebas)" },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateGambarAnak(tpl.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-black cursor-pointer border ${
                    templateGambarAnak === tpl.id
                      ? "bg-indigo-600 text-white border-indigo-700"
                      : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setJumlahGoresan(0);
                  setTotalPanjangGoresan(0);
                  gambarOutlineTemplateDiKanvas(templateGambarAnak);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 font-black cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 inline mr-1" /> Bersihkan Kanvas
              </button>
            </div>
          </div>

          {/* Palet Warna Ceria Anak */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                <Paintbrush className="w-4 h-4 text-rose-600" /> Pilih Warna Kuas:
              </span>
              {[
                "#e11d48",
                "#f97316",
                "#facc15",
                "#22c55e",
                "#06b6d4",
                "#2563eb",
                "#9333ea",
                "#ec4899",
                "#78350f",
                "#0f172a",
              ].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setWarnaKuas(hex)}
                  style={{ backgroundColor: hex }}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 transition ${
                    warnaKuas === hex ? "scale-125 ring-4 ring-amber-300 border-white" : "border-slate-300"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span>Ukuran Kuas:</span>
              <input
                type="range"
                min={4}
                max={26}
                value={ukuranKuas}
                onChange={(e) => setUkuranKuas(Number(e.target.value))}
                className="w-24"
              />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black">
                {warnaTerpakaiSet.size} Warna • {jumlahGoresan} Goresan
              </span>
            </div>
          </div>

          <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border-2 border-dashed border-slate-300">
            <canvas
              ref={canvasRef}
              width={540}
              height={240}
              onMouseDown={mulaiGoresKanvas}
              onMouseMove={lanjutkanGoresKanvas}
              onMouseUp={() => setSedangMenggambar(false)}
              onMouseLeave={() => setSedangMenggambar(false)}
              className="w-full max-w-[540px] h-[240px] bg-white rounded-2xl shadow-inner cursor-crosshair border border-slate-200"
            />
          </div>
        </div>

        {/* LANGKAH 2: PERMAINAN PILIH GAMBAR KESUKAAN ANAK (AWAL 100% KOSONG) */}
        <div className="print:hidden bg-white p-6 rounded-3xl border-2 border-sky-300 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-100 text-sky-900">
                Langkah 2 • Tes Kartu Visual Anak ({Object.keys(jawabanKartuAnak).length} / 6 Dipilih)
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                🖼️ Ajak Anak Menunjuk Gambar yang Paling Ia Sukai!
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setJawabanKartuAnak({})}
              className="text-xs font-bold text-rose-600 cursor-pointer"
            >
              Kosongkan Pilihan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KARTU_VISUAL_ANAK.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="font-black text-xs sm:text-sm text-slate-900">
                  {item.id}. {item.pertanyaan}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {item.opsi.map((op, idx) => {
                    const dipilih = jawabanKartuAnak[item.id] === op.kode;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setJawabanKartuAnak((prev) => ({
                            ...prev,
                            [item.id]: op.kode,
                          }))
                        }
                        className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                          dipilih
                            ? "bg-amber-400 text-slate-950 border-rose-600 scale-102 shadow-md"
                            : "bg-white text-slate-700 border-slate-200 hover:border-sky-400"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{op.ikon}</span>
                        <span className="font-black text-[11px] leading-snug">
                          {op.teks}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LANGKAH 3: CHECKLIST OBSERVASI ORANG TUA / GURU */}
        <div className="print:hidden bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-lg space-y-4">
          <div className="border-b pb-3">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Langkah 3 • Pengamatan Orang Tua / Guru Pendamping
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              ✅ Centang Kebiasaan yang Paling Sering Terlihat pada Anak Sehari-hari
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OBSERVASI_ORTU_ANAK.map((ob) => {
              const aktif = Boolean(observasiOrtu[ob.id]);
              return (
                <label
                  key={ob.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                    aktif
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(e) =>
                      setObservasiOrtu((prev) => ({
                        ...prev,
                        [ob.id]: e.target.checked,
                      }))
                    }
                    className="mt-1 w-4 h-4"
                  />
                  <span className="text-xs font-bold leading-relaxed">
                    {ob.label}
                  </span>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setTampilkanHasilAnak(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm shadow-xl cursor-pointer"
          >
            🎉 Analisis &amp; Tampilkan Rekomendasi Les / Kursus Terbaik untuk {namaPeserta || "Ananda"}!
          </button>
        </div>

        {/* LAPORAN HASIL BAKAT ANAK & REKOMENDASI LES/KEGIATAN (SIAP PRINT PDF) */}
        {tampilkanHasilAnak && (
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 print:border-none print:shadow-none">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b-4 border-emerald-600 pb-4 break-inside-avoid">
              <div className="flex items-center gap-3.5">
                <img
                  src="/hibahilmu.jpg"
                  alt="Logo Panda HibahIlmu"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                  }}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600"
                />
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-700">
                    PANDA HIBAHILMU • KIDS MULTIPLE INTELLIGENCES &amp; MOTORIC REPORT
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Laporan Pemetaan Bakat &amp; Rekomendasi Les Anak
                  </h2>
                  <div className="text-xs font-bold text-slate-600">
                    Ananda: <strong>{namaPeserta || "Ananda Tercinta"}</strong> • {instansiPeserta}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" /> Cetak PDF Laporan Anak
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 break-inside-avoid">
              {hasilAnak.top3.map((item, idx) => (
                <div
                  key={item.kode}
                  className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 space-y-2 break-inside-avoid"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{item.info.ikon}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                      Bakat Utama #{idx + 1} ({item.persen}%)
                    </span>
                  </div>
                  <div className="font-black text-sm text-slate-900">
                    {item.info.nama}
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-black uppercase text-indigo-800">
                      🎯 Perlu Dileskan / Diikutkan Kegiatan Apa?
                    </div>
                    <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-0.5">
                      {item.info.rekomendasiLes.map((les) => (
                        <li key={les}>{les}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[11px] text-slate-600 pt-1">
                    <strong>Tips di Rumah:</strong> {item.info.kegiatanRumah}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-800">
                    🌟 Potensi Karier Dewasa: {item.info.potensiMasaDepan}
                  </p>
                </div>
              ))}
            </div>

            {/* Grafik Bar 7 Dimensi Bakat Anak */}
            <div className="p-5 rounded-2xl bg-slate-50 border space-y-3 break-inside-avoid">
              <div className="font-black text-xs uppercase text-slate-800">
                📊 Peta Lengkap 7 Kecerdasan &amp; Fisik-Motorik Ananda {namaPeserta}
              </div>
              <div className="space-y-2">
                {hasilAnak.daftarUrut.map((d) => (
                  <div key={d.kode} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>
                        {d.info.ikon} {d.info.nama}
                      </span>
                      <span>{d.persen}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        style={{
                          width: `${d.persen}%`,
                          backgroundColor: d.info.warna,
                        }}
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER 2: STUDIO TALENT MAPPING SMP & SD ATAS (9–15 TAHUN)
  // ==========================================================================
  if (modeJenjang === "smp") {
    const jmlIsiSmp = Object.keys(jawabanSmp).length;
    const skorVAK = { visual: 0, auditori: 0, kinestetik: 0 };
    const skorKlasterSmp: Record<string, number> = {};

    SOAL_SMP_EKSPLORASI.forEach((s) => {
      const val = jawabanSmp[s.no] || 0;
      skorVAK[s.kategori as "visual" | "auditori" | "kinestetik"] += val;
      skorKlasterSmp[s.klaster] = (skorKlasterSmp[s.klaster] || 0) + val;
    });

    const vakDominan = Object.entries(skorVAK).sort((a, b) => b[1] - a[1])[0][0];
    const klasterSmpUrut = Object.entries(skorKlasterSmp).sort(
      (a, b) => b[1] - a[1]
    );

    return (
      <div className="space-y-6">
        <div className="print:hidden bg-gradient-to-r from-indigo-900 via-sky-800 to-emerald-800 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase">
              🧭 Khusus Siswa SD Kelas 4–6 &amp; SMP (Usia 9–15 Tahun)
            </span>
            <h2 className="text-2xl font-black mt-1">
              Tes Gaya Belajar (Visual-Auditori-Kinestetik) &amp; Minat Ekstrakurikuler
            </h2>
            <p className="text-xs text-slate-200">
              Semua pilihan awalnya kosong. Begitu diklik, otomatis menandai progresmu dan memberikan rekomendasi cara belajar anti-bosan serta persiapan masuk SMA/SMK!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setJawabanSmp({})}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Kosongkan Pilihan ({jmlIsiSmp}/12)
          </button>
        </div>

        <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOAL_SMP_EKSPLORASI.map((s) => {
            const nilai = jawabanSmp[s.no];
            return (
              <div
                key={s.no}
                className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-700">
                  <span>Soal #{s.no} • {s.klaster}</span>
                  <span>{nilai ? `✓ Terisi (${nilai})` : "○ Belum Diisi"}</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-slate-800">
                  &ldquo;{s.teks}&rdquo;
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { v: 1, l: "Tidak Cocok" },
                    { v: 2, l: "Kurang" },
                    { v: 3, l: "Biasa" },
                    { v: 4, l: "Cocok" },
                    { v: 5, l: "Sangat Gue!" },
                  ].map((op) => (
                    <button
                      key={op.v}
                      type="button"
                      onClick={() =>
                        setJawabanSmp((prev) => ({ ...prev, [s.no]: op.v }))
                      }
                      className={`p-2 rounded-xl border text-[10px] font-black cursor-pointer transition ${
                        nilai === op.v
                          ? "bg-emerald-500 text-slate-950 border-slate-900 scale-105"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400"
                      }`}
                    >
                      <div className="text-sm">{op.v}</div>
                      <div>{op.l}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="print:hidden flex justify-center">
          <button
            type="button"
            onClick={() => setTampilkanHasilSmp(true)}
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 inline mr-1.5" /> Lihat Hasil Gaya Belajar &amp; Rekomendasi SMP ({jmlIsiSmp}/12 Terisi)
          </button>
        </div>

        {tampilkanHasilSmp && (
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 break-inside-avoid">
            <div className="flex justify-between items-center border-b-2 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Laporan Gaya Belajar (VAK) &amp; Pemetaan Minat Siswa SMP — {namaPeserta || "Siswa"}
                </h3>
                <p className="text-xs font-bold text-emerald-700">
                  Gaya Belajar Dominan: {vakDominan.toUpperCase()} LEARNER • Minat #1: {klasterSmpUrut[0]?.[0]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="print:hidden px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 inline mr-1" /> Cetak PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                <div className="font-black text-xs text-indigo-900 uppercase">
                  👁️ Visual ({skorVAK.visual} Poin)
                </div>
                <p className="text-xs text-slate-700">
                  Gunakan peta konsep (Mind Map), video animasi, dan catatan warna-warni agar cepat hafal.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="font-black text-xs text-amber-900 uppercase">
                  🎧 Auditori ({skorVAK.auditori} Poin)
                </div>
                <p className="text-xs text-slate-700">
                  Belajarlah dengan diskusi kelompok, membaca nyaring, atau mendengarkan penjelasan audio.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-black text-xs text-emerald-900 uppercase">
                  🛠️ Kinestetik ({skorVAK.kinestetik} Poin)
                </div>
                <p className="text-xs text-slate-700">
                  Perbanyak latihan praktik langsung, eksperimen laboratorium, dan proyek merakit alat.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // RENDER 3: STUDIO PENJURUSAN SMA / SMK & KULIAH (15–18 TAHUN: RIASEC)
  // ==========================================================================
  const jmlIsiSma = Object.keys(jawabanSma).length;
  const skorRiasec: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  SOAL_SMA_RIASEC.forEach((s) => {
    skorRiasec[s.tipe] += jawabanSma[s.no] || 0;
  });
  const urutRiasec = Object.entries(skorRiasec).sort((a, b) => b[1] - a[1]);
  const top2Riasec = urutRiasec.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="print:hidden bg-gradient-to-r from-purple-950 via-indigo-900 to-rose-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase">
            🎯 Khusus Remaja SMA / SMK / MA (Usia 15–18 Tahun)
          </span>
          <h2 className="text-2xl font-black mt-1">
            Tes Penjurusan Kuliah (SNBP/SNBT), Mapel Pilihan &amp; RIASEC Holland
          </h2>
          <p className="text-xs text-slate-200">
            Membantu siswa SMA/SMK menentukan Mata Pelajaran Pilihan Kurikulum Merdeka dan Jurusan Kuliah paling akurat!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setJawabanSma({})}
          className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" /> Kosongkan Pilihan ({jmlIsiSma}/12)
        </button>
      </div>

      <div className="print:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOAL_SMA_RIASEC.map((s) => {
          const nilai = jawabanSma[s.no];
          return (
            <div
              key={s.no}
              className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-purple-800">
                <span>#{s.no} • {s.namaTipe}</span>
                <span>{nilai ? `✓ Skor ${nilai}` : "○ Belum Diisi"}</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-800">
                &ldquo;{s.teks}&rdquo;
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { v: 1, l: "Sangat Tidak" },
                  { v: 2, l: "Kurang" },
                  { v: 3, l: "Netral" },
                  { v: 4, l: "Minat" },
                  { v: 5, l: "Sangat Minat!" },
                ].map((op) => (
                  <button
                    key={op.v}
                    type="button"
                    onClick={() =>
                      setJawabanSma((prev) => ({ ...prev, [s.no]: op.v }))
                    }
                    className={`p-2 rounded-xl border text-[10px] font-black cursor-pointer transition ${
                      nilai === op.v
                        ? "bg-amber-400 text-slate-950 border-slate-900 scale-105"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-400"
                    }`}
                  >
                    <div className="text-sm">{op.v}</div>
                    <div>{op.l}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="print:hidden flex justify-center">
        <button
          type="button"
          onClick={() => setTampilkanHasilSma(true)}
          className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl cursor-pointer"
        >
          <GraduationCap className="w-5 h-5 inline mr-1.5" /> Analisis Rekomendasi Jurusan Kuliah &amp; Mapel Pilihan SMA
        </button>
      </div>

      {tampilkanHasilSma && (
        <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-6 break-inside-avoid">
          <div className="flex justify-between items-center border-b-2 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Laporan Penjurusan Kuliah &amp; Karier RIASEC SMA/SMK — {namaPeserta || "Siswa SMA"}
              </h3>
              <p className="text-xs font-bold text-purple-800">
                Kode Kepribadian Karier: {top2Riasec.map((x) => x[0]).join("-")} ({REKOMENDASI_RIASEC_SMA[top2Riasec[0][0]]?.judul})
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 inline mr-1" /> Cetak PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {top2Riasec.map(([kode], idx) => {
              const info = REKOMENDASI_RIASEC_SMA[kode];
              if (!info) return null;
              return (
                <div
                  key={kode}
                  className="p-4 rounded-2xl bg-purple-50/60 border-2 border-purple-300 space-y-2.5 break-inside-avoid"
                >
                  <div className="font-black text-sm text-purple-950">
                    #{idx + 1}. {info.judul}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-indigo-800">
                      📘 Mapel Pilihan SMA (Kurikulum Merdeka):
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {info.mapelPilihanKurikulumMerdeka.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-white border text-[11px] font-bold"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-emerald-800">
                      🎓 Rekomendasi Jurusan Kuliah (SNBP / SNBT):
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {info.jurusanKuliahSaintekSoshum.map((j) => (
                        <span
                          key={j}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 text-[11px] font-bold"
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};