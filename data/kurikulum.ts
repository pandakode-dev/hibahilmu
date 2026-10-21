export interface KuisItem {
  tanya: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

export interface KelasItem {
  id: string;
  judul: string;
  kategori: string;
  level: "Pemula" | "Menengah" | "Mahir";
  durasi: string;
  videoUrl: string;
  rangkuman: string;
  rumusMatematika?: string; // Fitur 3: Dukungan Rumus Matematika/Fisika
  contohKode?: string; // Fitur 3: Dukungan Blok Kode Pemrograman
  kuis: KuisItem;
}

export interface JenjangItem {
  id: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  gradien: string;
  teksWarna: string;
  badge: string;
  ikonNama: string;
  kelas: KelasItem[];
}

export interface SoalTryout {
  id: string;
  jenjang: string;
  pertanyaan: string;
  rumus?: string;
  opsi: string[];
  jawabanBenar: number;
  pembahasan: string;
}

export interface DiskusiPR {
  id: string;
  penanya: string;
  jenjang: string;
  mapel: string;
  pertanyaan: string;
  waktu: string;
  jawaban: {
    penjawab: string;
    isi: string;
    apakahRelawan: boolean;
  }[];
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

// 1. DATA MATERI PEMBELAJARAN LENGKAP DENGAN LEVEL, RUMUS & KODE
export const DATA_JENJANG_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK & PAUD",
    tagline: "Dunia Bermain & Imajinasi",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi ceria.",
    gradien: "from-pink-500 via-rose-500 to-orange-400",
    teksWarna: "text-rose-600",
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
        rangkuman:
          "Mari belajar menghitung buah-buahan di sekitar kita! Angka 1 bentuknya seperti tiang listrik, angka 2 seperti bebek berenang, dan angka 3 seperti burung terbang.",
        rumusMatematika: "2 🍎 + 1 🍎 = 3 🍎 (Tiga Apel Segar)",
        kuis: {
          tanya: "Jika Budi punya 2 apel merah lalu diberi Ibu 1 apel lagi, berapa jumlah apel Budi sekarang?",
          opsi: ["2 Apel", "3 Apel", "4 Apel", "5 Apel"],
          jawabanBenar: 1,
          pembahasan: "Hebat sekali! 2 apel ditambah 1 apel menjadi 3 apel!",
        },
      },
      {
        id: "tk-2",
        judul: "Petualangan Huruf Vokal (A, I, U, E, O)",
        kategori: "Membaca Permulaan",
        level: "Pemula",
        durasi: "6 Menit",
        videoUrl: "https://www.youtube.com/embed/bGetqbqDVaA",
        rangkuman:
          "Huruf vokal adalah huruf hidup yang membuat kata bisa dibaca dengan nyaring. A untuk Ayam, I untuk Ikan, U untuk Udang, E untuk Elang, dan O untuk Obat!",
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
    teksWarna: "text-amber-700",
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
        rangkuman:
          "Perkalian adalah penjumlahan yang berulang! Konsep ini juga kita pakai untuk menghitung luas persegi panjang dan segitiga di sekolah.",
        rumusMatematika: "Luas Segitiga = ½ × Alas (a) × Tinggi (t)\nLuas Persegi Panjang = Panjang (p) × Lebar (l)",
        kuis: {
          tanya: "Sebuah segitiga memiliki alas 6 cm dan tinggi 4 cm. Berapakah luasnya?",
          opsi: ["10 cm²", "12 cm²", "24 cm²", "18 cm²"],
          jawabanBenar: 1,
          pembahasan: "Tepat! Luas = ½ × 6 × 4 = 12 cm².",
        },
      },
      {
        id: "sd-2",
        judul: "Siklus Air Hujan & Eksperimen Sains",
        kategori: "Sains / IPA",
        level: "Menengah",
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
    teksWarna: "text-blue-600",
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
        rangkuman:
          "Aljabar menggunakan huruf (seperti x atau y) untuk mewakili angka misterius. Sementara Pythagoras membantu kita mencari sisi miring segitiga siku-siku.",
        rumusMatematika: "Rumus Pythagoras: a² + b² = c²  ⟹  c = √(a² + b²)\nPersamaan Linier: 2x + 4 = 14  ⟹  2x = 10  ⟹  x = 5",
        kuis: {
          tanya: "Jika segitiga siku-siku memiliki alas a = 3 cm dan tinggi b = 4 cm, berapakah sisi miringnya (c)?",
          opsi: ["c = 5 cm", "c = 6 cm", "c = 7 cm", "c = 25 cm"],
          jawabanBenar: 0,
          pembahasan: "Luar biasa! c = √(3² + 4²) = √(9 + 16) = √25 = 5 cm.",
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
    teksWarna: "text-purple-600",
    badge: "bg-purple-100 text-purple-800",
    ikonNama: "school",
    kelas: [
      {
        id: "sma-1",
        judul: "Fisika Mekanika, Hukum Newton & Kalkulus Dasar",
        kategori: "Fisika & Matematika SMA",
        level: "Mahir",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rangkuman:
          "Dalam fisika mekanika, gaya berbanding lurus dengan massa dan percepatan benda. Sedangkan energi kinetik bergantung pada kuadrat kecepatannya.",
        rumusMatematika: "Hukum II Newton: ∑F = m · a\nEnergi Kinetik: Ek = ½ · m · v²\nRumus Kuadrat (ABC): x₁,₂ = (-b ± √(b² - 4ac)) / 2a",
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
    teksWarna: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    ikonNama: "graduation",
    kelas: [
      {
        id: "kuliah-1",
        judul: "Fullstack Next.js & Algoritma Pemrograman (Panda Kode)",
        kategori: "Teknik Informatika",
        level: "Mahir",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        rangkuman:
          "React dan Next.js menggunakan konsep Component serta State. Perhatikan contoh penulisan kode fungsi interaktif di bawah ini yang bisa langsung kamu praktikkan di VS Code.",
        contohKode: `// Contoh Kode React Hook oleh Panda Kode
import { useState } from "react";

export default function PenghitungPahala() {
  const [skor, setSkor] = useState(0);

  return (
    <button onClick={() => setSkor(skor + 10)}>
      Klik Tambah Ilmu: {skor} XP
    </button>
  );
}`,
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

// 2. DATA BANK SOAL SIMULASI TRYOUT BERWAKTU
export const BANK_SOAL_TRYOUT: SoalTryout[] = [
  {
    id: "to-1",
    jenjang: "SD / MI",
    pertanyaan: "Hasil operasi hitung campuran dari 25 + (12 × 3) - 10 adalah...",
    rumus: "Ingat aturan KABATAKU: Kerjakan tanda kurung dan perkalian terlebih dahulu!",
    opsi: ["51", "101", "61", "45"],
    jawabanBenar: 0,
    pembahasan: "12 × 3 = 36. Lalu 25 + 36 - 10 = 51.",
  },
  {
    id: "to-2",
    jenjang: "SMP / MTs",
    pertanyaan: "Jika f(x) = 3x - 5, maka berapakah nilai dari f(4)?",
    rumus: "Substitusikan nilai x = 4 ke dalam fungsi f(x) = 3(x) - 5",
    opsi: ["5", "7", "12", "17"],
    jawabanBenar: 1,
    pembahasan: "f(4) = 3(4) - 5 = 12 - 5 = 7.",
  },
  {
    id: "to-3",
    jenjang: "SMA / UTBK",
    pertanyaan: "Turunan pertama dari fungsi aljabar f(x) = 4x³ - 6x² + 2x adalah...",
    rumus: "Rumus Turunan: f(x) = a·xⁿ  ⟹  f'(x) = n·a·xⁿ⁻¹",
    opsi: [
      "f'(x) = 12x² - 12x + 2",
      "f'(x) = 12x³ - 6x + 2",
      "f'(x) = 4x² - 12x",
      "f'(x) = 8x² - 12x + 2",
    ],
    jawabanBenar: 0,
    pembahasan: "Turunan 4x³ adalah 12x², turunan -6x² adalah -12x, dan turunan 2x adalah 2.",
  },
  {
    id: "to-4",
    jenjang: "Kuliah IT (Panda Kode)",
    pertanyaan: "Perintah Git manakah yang digunakan untuk mengirim (upload) commit lokal dari laptop ke repositori GitHub?",
    rumus: "git add .  ➔  git commit -m 'pesan'  ➔  ???",
    opsi: ["git pull", "git push", "git init", "git clone"],
    jawabanBenar: 1,
    pembahasan: "Tepat sekali! git push digunakan untuk mengunggah perubahan kode lokal ke server GitHub.",
  },
];

// 3. DATA AWAL FORUM DISKUSI TANYA PR KOMUNITAS
export const DISKUSI_PR_AWAL: DiskusiPR[] = [
  {
    id: "pr-1",
    penanya: "Rizky Pratama (Siswa Kelas 8 SMP)",
    jenjang: "SMP",
    mapel: "Matematika",
    pertanyaan: "Kak, bagaimana cara cepat membedakan rumus Keliling Lingkaran dan Luas Lingkaran supaya tidak tertukar saat ujian?",
    waktu: "2 jam yang lalu",
    jawaban: [
      {
        penjawab: "Panda Kode (Founder & Mentor)",
        isi: "Tips mudahnya: Ingat saja Luas itu satuannya selalu pangkat dua (cm²), jadi rumusnya pasti yang pakai r pangkat dua (π × r²). Kalau Keliling tidak pakai pangkat, jadi angka 2-nya taruh di depan (2 × π × r). Semangat belajarnya ya!",
        apakahRelawan: true,
      },
    ],
  },
  {
    id: "pr-2",
    penanya: "Siti Rahma (Siswi Kelas 12 SMA)",
    jenjang: "SMA",
    mapel: "Informatika & Kuliah",
    pertanyaan: "Saya ingin kuliah jurusan Teknik Informatika tapi belum pernah ngoding sama sekali. Harus mulai belajar dari mana ya kak?",
    waktu: "5 jam yang lalu",
    jawaban: [
      {
        penjawab: "Kak Dimas (Relawan Mahasiswa IT)",
        isi: "Jangan takut! Mulai dulu dari logika dasar HTML, CSS, dan JavaScript yang ada di ruang kelas Kuliah HibahIlmu ini. Semuanya gratis dan dijelaskan dari nol.",
        apakahRelawan: true,
      },
    ],
  },
];

// 4. DATA TRANSPARANSI DANA AMAL / DONASI UMAT
export const DATA_TRANSPARANSI_DONASI = {
  totalTerkumpul: 850000,
  targetTahunan: 1500000,
  riwayatDonatur: [
    { nama: "Hamba Allah (Jakarta)", nominal: 250000, pesan: "Semoga menjadi amal jariyah untuk Panda Kode dan mencerdaskan anak bangsa.", tanggal: "18 Okt 2026" },
    { nama: "Kak Budi Santoso (Surabaya)", nominal: 150000, pesan: "Untuk bantu patungan beli domain hibahilmu.id!", tanggal: "15 Okt 2026" },
    { nama: "Alumni Mahasiswa IT", nominal: 300000, pesan: "Terima kasih sudah membuat platform belajar gratis tanpa iklan judi/berbayar.", tanggal: "10 Okt 2026" },
    { nama: "Ibu Rina (Orang Tua Siswa SD)", nominal: 150000, pesan: "Anak saya terbantu sekali belajar matematika di sini.", tanggal: "05 Okt 2026" },
  ],
  alokasiPenggunaan: [
    { keperluan: "Biaya Server Vercel & Database Cloud", biaya: "Rp 0 (Gratis Tier Komunitas)", status: "Aktif" },
    { keperluan: "Rencana Pembelian Domain Resmi hibahilmu.id (1 Tahun)", biaya: "Rp 250.000", status: "Tabungan Terkumpul" },
    { keperluan: "Pengembangan Modul Video Animasi TK - Kuliah", biaya: "Rp 600.000", status: "Dialokasikan untuk Relawan" },
  ],
};