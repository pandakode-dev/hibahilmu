// app/mockData.ts

import {
  JenjangItem,
  AkunPengguna,
  NotifikasiItem,
  LogAktivitas,
  KelompokBelajar,
  PaketTryout,
  SoalTryout,
  TugasItem,
  PengumpulanTugas,
  JadwalLiveItem,
  StudyRoomItem,
  PengajuanBeasiswaItem,
  RppItem,
  OfficeHourItem,
  DiskusiPR,
  TransparansiDonasi,
} from "./types";

// Fungsi Bantuan Bersihkan Tag HTML
export function bersihkanTagHtml(teksHtml: string): string {
  if (!teksHtml) return "";
  return teksHtml
    .split("<")
    .map((bagian, idx) => (idx === 0 ? bagian : bagian.substring(bagian.indexOf(">") + 1)))
    .join(" ");
}

// Fungsi Analisis AI Rubric Scoring Esai Siswa
export function analisisRubrikEsaiAI(teksJawaban: string) {
  const panjangKata = teksJawaban.trim().split(/\s+/).filter(Boolean).length;
  const adaSitasi =
    teksJawaban.includes("http") ||
    teksJawaban.toLowerCase().includes("menurut") ||
    teksJawaban.toLowerCase().includes("referensi") ||
    teksJawaban.toLowerCase().includes("rumus");

  const skorArgumen = Math.min(100, Math.max(68, 60 + panjangKata * 2));
  const skorTataBahasa = panjangKata >= 8 ? 92 : 78;
  const skorReferensi = adaSitasi ? 95 : 75;
  const rekomendasiTotal = Math.round(
    skorArgumen * 0.4 + skorTataBahasa * 0.3 + skorReferensi * 0.3
  );

  return {
    argumen: skorArgumen,
    tataBahasa: skorTataBahasa,
    referensi: skorReferensi,
    rekomendasiTotal,
    catatanAi: `AI Rubric Assistant: Argumen terstruktur (${panjangKata} kata). ${
      adaSitasi
        ? "Terdapat rujukan/tautan pendukung yang kuat."
        : "Disarankan menambahkan referensi ilmiah atau rumus pendukung."
    }`,
  };
}

export const TEMPLATE_CSV_AKUN = `nama;email;password;role;infoTambahan
Rizky Pratama;rizky@siswa.id;123456;siswa;Siswa SMA Kelas 12
Dr. Hendra Wijaya;hendra@kampus.ac.id;123456;guru;Dosen Teknik & Sains`;

export const TEMPLATE_CSV_KUIS = `tipe;tanya;opsi;jawabanBenar;jawabanJamak;jawabanTeks;pembahasan;poin
pilihan_ganda;Berapakah hasil dari 15 x 4?;45|50|60|75;2;;;Karena 15 dikali 4 adalah 60;50`;

export const TEMPLATE_CSV_TRYOUT = `pertanyaan;opsi;jawabanBenar;pembahasan;rumus
"Jika 3x + 5 = 20, berapakah nilai x?";3|5|7|8;1;"3x = 15, maka x = 5";"3x + 5 = 20"`;

export const STRUKTUR_AWAL: JenjangItem[] = [
  {
    id: "tk",
    nama: "TK / PAUD",
    tagline: "Usia 4 - 6 Tahun",
    deskripsi: "Mengenal huruf, angka dasar, warna, dan budi pekerti lewat cerita interaktif.",
    gradien: "from-pink-500 to-rose-500",
    badge: "bg-pink-100 text-pink-800 border-pink-200",
    ikonNama: "Baby",
    subJenjang: [
      { id: "tk-a", nama: "TK Kecil (TK A)" },
      { id: "tk-b", nama: "TK Besar (TK B)" },
    ],
    kelas: [
      {
        id: "materi-tk-1",
        subJenjangId: "tk-a",
        judul: "Mengenal Huruf Vokal (A, I, U, E, O) & Berhitung Ceria",
        pembuatId: "guru-1",
        pembuatNama: "Bunda Siti Aminah, S.Pd",
        pembuatEmail: "siti.aminah@guru.id",
        tanggalUpload: "12 Okt 2026",
        level: "Pemula",
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Lima huruf vokal utama adalah <b>A, I, U, E, dan O</b>. Anak-anak diajak menyanyikan lagu huruf sambil menghitung jumlah buah apel.</p>",
        flashcards: [
          { id: "fc-tk-1", depan: "Huruf Vokal Pertama", belakang: "A (Contoh: Apel, Ayam)" },
          { id: "fc-tk-2", depan: "3 Apel + 2 Apel", belakang: "5 Buah Apel" },
        ],
        daftarKuis: [
          {
            id: "kuis-tk-1",
            tipe: "pilihan_ganda",
            tanya: "Huruf apakah yang menjadi awalan kata 'APEL'?",
            opsi: ["Huruf A", "Huruf B", "Huruf C", "Huruf D"],
            jawabanBenar: 0,
            pembahasan: "Kata APEL diawali oleh huruf vokal A.",
            poin: 50,
          },
        ],
      },
    ],
  },
  {
    id: "sd",
    nama: "Sekolah Dasar (SD)",
    tagline: "Kelas 1 - 6 SD",
    deskripsi: "Fondasi berhitung cepat, sains alam sekitar, dan bahasa Indonesia.",
    gradien: "from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    ikonNama: "Shapes",
    subJenjang: [
      { id: "sd-1", nama: "Kelas 1 SD" },
      { id: "sd-6", nama: "Kelas 6 SD" },
    ],
    kelas: [
      {
        id: "materi-sd-1",
        subJenjangId: "sd-1",
        judul: "Operasi Hitung Penjumlahan & Pengurangan Cepat",
        pembuatId: "guru-1",
        pembuatNama: "Pak Budi Santoso, M.Pd",
        pembuatEmail: "budi.santoso@guru.id",
        tanggalUpload: "14 Okt 2026",
        level: "Pemula",
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Penjumlahan adalah menggabungkan sekelompok bilangan menjadi satu jumlah terbaru.</p>",
        rumusMatematika: "a + b = c \\quad \\text{dan} \\quad c - b = a",
        flashcards: [
          { id: "fc-sd-1", depan: "12 + 8", belakang: "20" },
          { id: "fc-sd-2", depan: "25 - 9", belakang: "16" },
        ],
        daftarKuis: [
          {
            id: "kuis-sd-1",
            tipe: "pilihan_ganda",
            tanya: "Ibu membeli 12 jeruk, lalu membeli lagi 8 jeruk. Berapa totalnya?",
            opsi: ["18 Jeruk", "19 Jeruk", "20 Jeruk", "22 Jeruk"],
            jawabanBenar: 2,
            pembahasan: "12 ditambah 8 sama dengan 20 jeruk.",
            poin: 50,
          },
        ],
      },
    ],
  },
  {
    id: "smp",
    nama: "SMP / MTs",
    tagline: "Kelas 7 - 9 SMP",
    deskripsi: "Eksplorasi Aljabar, Fisika Dasar, Biologi Terpadu, dan Bahasa Inggris.",
    gradien: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
    ikonNama: "Compass",
    subJenjang: [
      { id: "smp-7", nama: "Kelas 7 SMP" },
      { id: "smp-9", nama: "Kelas 9 SMP" },
    ],
    kelas: [
      {
        id: "materi-smp-1",
        subJenjangId: "smp-7",
        judul: "Persamaan Linear Satu Variabel (Aljabar Dasar)",
        pembuatId: "guru-1",
        pembuatNama: "Pak Budi Santoso, M.Pd",
        pembuatEmail: "budi.santoso@guru.id",
        tanggalUpload: "15 Okt 2026",
        level: "Menengah",
        durasi: "20 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Variabel adalah lambang pengganti suatu bilangan yang belum diketahui nilainya dengan jelas.</p>",
        rumusMatematika: "ax + b = c \\implies x = \\frac{c - b}{a}",
        flashcards: [
          { id: "fc-smp-1", depan: "Bentuk Umum PLSV", belakang: "ax + b = 0" },
          { id: "fc-smp-2", depan: "Jika 2x + 4 = 10, maka x = ?", belakang: "x = 3" },
        ],
        daftarKuis: [
          {
            id: "kuis-smp-1",
            tipe: "pilihan_ganda",
            tanya: "Jika 2x + 4 = 10, berapakah nilai x?",
            opsi: ["x = 2", "x = 3", "x = 4", "x = 6"],
            jawabanBenar: 1,
            pembahasan: "2x = 6, maka x = 3.",
            poin: 50,
          },
        ],
      },
    ],
  },
  {
    id: "sma",
    nama: "SMA / SMK",
    tagline: "Kelas 10 - 12 & UTBK",
    deskripsi: "Mekanika Fisika, Kimia Analitik, Ekonomi, serta Persiapan SNBT.",
    gradien: "from-blue-600 to-indigo-600",
    badge: "bg-blue-100 text-blue-900 border-blue-200",
    ikonNama: "BookOpen",
    subJenjang: [
      { id: "sma-10-ipa", nama: "Kelas 10 MIPA" },
      { id: "sma-11-ipa", nama: "Kelas 11 MIPA" },
      { id: "sma-12-ipa", nama: "Kelas 12 MIPA & UTBK" },
    ],
    kelas: [
      {
        id: "materi-sma-1",
        subJenjangId: "sma-11-ipa",
        judul: "Hukum II Newton, Energi Kinetik & Dinamika Partikel",
        pembuatId: "guru-1",
        pembuatNama: "Pak Budi Santoso, M.Pd",
        pembuatEmail: "budi.santoso@guru.id",
        tanggalUpload: "16 Okt 2026",
        level: "Menengah",
        durasi: "25 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        lampiranUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        rangkuman:
          "<h3>Konsep Dasar Hukum II Newton</h3><p>Percepatan sebuah benda berbanding lurus dengan gaya total yang bekerja padanya dan berbanding terbalik dengan massanya.</p>",
        rumusMatematika: "\\sum F = m \\cdot a \\quad \\text{dan} \\quad E_k = \\frac{1}{2} m v^2",
        flashcards: [
          { id: "fc-sma-1", depan: "Rumus Hukum II Newton", belakang: "ΣF = m · a (Gaya = Massa × Percepatan)" },
          { id: "fc-sma-2", depan: "Rumus Energi Kinetik", belakang: "Ek = ½ · m · v²" },
          { id: "fc-sma-3", depan: "Satuan Gaya dalam SI", belakang: "Newton (N) atau kg·m/s²" },
        ],
        ulasan: [
          {
            id: "ul-1",
            siswaNama: "Aisyah Putri",
            bintang: 5,
            komentar: "Penjelasan rumus dan fitur Audiobook-nya sangat membantu!",
            waktu: "Kemarin",
          },
        ],
        daftarKuis: [
          {
            id: "kuis-sma-1",
            tipe: "pilihan_ganda",
            tanya: "Sebuah benda bermassa 5 kg diberi gaya 20 N. Berapa percepatannya?",
            opsi: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"],
            jawabanBenar: 1,
            pembahasan: "a = F / m = 20 / 5 = 4 m/s².",
            poin: 50,
          },
        ],
      },
      {
        id: "materi-sma-2",
        subJenjangId: "sma-12-ipa",
        judul: "Fisika Modern: Relativitas Khusus & Efek Fotolistrik",
        pembuatId: "guru-1",
        pembuatNama: "Pak Budi Santoso, M.Pd",
        pembuatEmail: "budi.santoso@guru.id",
        tanggalUpload: "18 Okt 2026",
        level: "Mahir",
        prasyaratKelasId: "materi-sma-1",
        durasi: "30 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Modul tingkat lanjut ini memerlukan kelulusan dari modul <b>Hukum II Newton & Energi Kinetik</b> terlebih dahulu (Skill Tree Prerequisite).</p>",
        rumusMatematika: "E = m c^2",
        flashcards: [
          { id: "fc-sma-m1", depan: "Kesetaraan Massa-Energi Einstein", belakang: "E = m · c²" },
        ],
        daftarKuis: [
          {
            id: "kuis-sma-m1",
            tipe: "pilihan_ganda",
            tanya: "Siapakah pencetus teori relativitas khusus E = mc²?",
            opsi: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Max Planck"],
            jawabanBenar: 1,
            pembahasan: "Albert Einstein mengemukakan teori relativitas khusus pada tahun 1905.",
            poin: 75,
          },
        ],
      },
    ],
  },
  {
    id: "kuliah",
    nama: "Perguruan Tinggi & Karier",
    tagline: "Mahasiswa & Riset",
    deskripsi: "Teknik Informatika, Big Data, AI, Penulisan Ilmiah, dan Persiapan Kerja.",
    gradien: "from-purple-600 to-violet-700",
    badge: "bg-purple-100 text-purple-900 border-purple-200",
    ikonNama: "GraduationCap",
    subJenjang: [
      { id: "pt-ti", nama: "Teknik Informatika & AI" },
      { id: "pt-riset", nama: "Metodologi Riset & Jurnal" },
    ],
    kelas: [
      {
        id: "materi-pt-1",
        subJenjangId: "pt-ti",
        judul: "Arsitektur Big Data (Kafka, Flume, Sqoop) & Reinforcement Learning",
        pembuatId: "guru-1",
        pembuatNama: "Pak Budi Santoso, M.Pd",
        pembuatEmail: "budi.santoso@guru.id",
        tanggalUpload: "17 Okt 2026",
        level: "Mahir",
        durasi: "35 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p><b>Apache Kafka</b> digunakan untuk message streaming real-time, sedangkan <b>Reinforcement Learning</b> melatih agen mengambil keputusan optimal berdasarkan <i>reward</i>.</p>",
        rumusMatematika:
          "Q(s,a) \\leftarrow Q(s,a) + \\alpha \\left[ r + \\gamma \\max_{a'} Q(s',a') - Q(s,a) \\right]",
        flashcards: [
          { id: "fc-pt-1", depan: "Fungsi Apache Kafka", belakang: "Distributed real-time event streaming platform" },
          { id: "fc-pt-2", depan: "Fungsi Apache Sqoop", belakang: "Transfer data antara Hadoop (HDFS) dan RDBMS" },
        ],
        daftarKuis: [
          {
            id: "kuis-pt-1",
            tipe: "pilihan_ganda",
            tanya: "Manakah komponen Big Data yang berfungsi mentransfer data antara RDBMS dan HDFS?",
            opsi: ["Apache Kafka", "Apache Flume", "Apache Sqoop", "Apache Spark"],
            jawabanBenar: 2,
            pembahasan: "Apache Sqoop dirancang untuk pertukaran data antara RDBMS dan Hadoop HDFS.",
            poin: 60,
          },
        ],
      },
    ],
  },
];

export const PAKET_TRYOUT_AWAL: PaketTryout[] = [
  {
    id: "pkt-tpa-1",
    judul: "Simulasi Akbar TPA (Tes Potensi Akademik) Bappenas & Pascasarjana",
    kategoriTes: "TPA",
    jenjang: "SMA, Mahasiswa & Umum",
    pembuatId: "guru-1",
    pembuatNama: "Pak Budi Santoso, M.Pd",
    alamatLokasi: "Gedung CBT Center Lt. 2 Ruang 204 / Online Proctored Fullscreen",
    jadwalUjian: "Minggu, 25 Okt 2026 • 08:00 - 10:00 WIB",
    durasiMenit: 15,
    batasPercobaan: 2,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "tpa-1",
        pertanyaan: "SINONIM: KONVENSI = ...",
        opsi: ["Kebijakan", "Kesamaan", "Kesimpulan", "Kesepakatan"],
        jawabanBenar: 3,
        pembahasan: "Konvensi memiliki arti permufakatan atau kesepakatan resmi.",
      },
      {
        id: "tpa-2",
        pertanyaan: "DERET ANGKA: 2, 4, 8, 16, 32, ...",
        rumus: "U_n = 2^n",
        opsi: ["48", "56", "64", "72"],
        jawabanBenar: 2,
        pembahasan: "Pola bilangan dikali 2 pada setiap sukunya: 32 x 2 = 64.",
      },
    ],
  },
  {
    id: "pkt-toefl-1",
    judul: "Diagnostic Test TOEFL ITP & TOEP (Structure & Written Expression)",
    kategoriTes: "TOEFL",
    jenjang: "SMA, Mahasiswa & Beasiswa",
    pembuatId: "guru-1",
    pembuatNama: "Pak Budi Santoso, M.Pd",
    alamatLokasi: "Lab Bahasa Terpadu R.102 / Online Fullscreen",
    jadwalUjian: "Sabtu, 31 Okt 2026 • 09:00 - 11:00 WIB",
    durasiMenit: 20,
    batasPercobaan: 2,
    batasPelanggaran: 3,
    wajibFullscreen: true,
    daftarSoal: [
      {
        id: "toefl-1",
        pertanyaan: "Neither the director nor the actors _____ present at the rehearsal yesterday.",
        opsi: ["was", "were", "is", "are"],
        jawabanBenar: 1,
        pembahasan: "Pada 'Neither... nor...', kata kerja mengikuti subjek terdekat (actors -> jamak + yesterday -> were).",
      },
    ],
  },
];

export const RPP_REPOSITORY_AWAL: RppItem[] = [
  {
    id: "rpp-1",
    judulRpp: "Modul Ajar Kurikulum Merdeka: Dinamika Gerak & Hukum Newton",
    mataPelajaran: "Fisika",
    jenjangKelas: "Kelas 11 MIPA",
    kurikulum: "Kurikulum Merdeka",
    pembuatNama: "Pak Budi Santoso, M.Pd",
    ringkasanTujuan: "Siswa mampu menganalisis hubungan gaya, massa, dan percepatan melalui eksperimen.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    jumlahUnduhan: 142,
    tanggalUpload: "15 Okt 2026",
  },
  {
    id: "rpp-2",
    judulRpp: "RPS (Rencana Pembelajaran Semester): Sistem Big Data & Reinforcement Learning",
    mataPelajaran: "Teknik Informatika",
    jenjangKelas: "Semester 5 Kuliah",
    kurikulum: "Silabus Kampus / RPS",
    pembuatNama: "Pak Budi Santoso, M.Pd",
    ringkasanTujuan: "Mahasiswa mampu merancang pipeline Apache Kafka dan algoritma Q-Learning.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    jumlahUnduhan: 89,
    tanggalUpload: "18 Okt 2026",
  },
];

export const OFFICE_HOURS_AWAL: OfficeHourItem[] = [
  {
    id: "oh-1",
    namaAhli: "Pak Budi Santoso, M.Pd",
    keahlian: "Pakar Fisika & Persiapan SNBT/TPA",
    topikBahasan: "Klinik Bedah Soal Mekanika & Strategi Tembus Skor TPA 600+",
    jadwalHariJam: "Jumat, 23 Okt 2026 • 16:00 - 17:30 WIB",
    meetingUrl: "https://meet.google.com",
    antreanPertanyaan: [
      {
        namaSiswa: "Aisyah Putri",
        pertanyaan: "Bagaimana cara membedakan gaya gesek statis dan kinetis pada bidang miring?",
      },
    ],
  },
];

export const AKUN_DEFAULT: AkunPengguna[] = [
  {
    id: "admin-1",
    nama: "Super Admin HibahIlmu",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "approved",
    infoTambahan: "Pengelola Utama Sistem",
    waktuDaftar: "10 Okt 2026",
    xp: 1500,
    aksesMengajar: ["ALL"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      headline: "Full-Stack EdTech Architect & Administrator",
      bioSingkat: "Mengelola infrastruktur dan kualitas konten pembelajaran terbuka.",
      asalSekolahKampus: "Institut Teknologi Nasional",
      pendidikanTerakhir: "S2 Sistem Informasi",
      skills: ["EdTech Management", "Next.js", "TypeScript", "Curriculum Design"],
      pengalaman: ["Lead Developer HibahIlmu.id (2025 - Sekarang)"],
      prestasi: ["Inovator Pendidikan Digital Terbaik 2026"],
      portfolioUrl: "https://hibahilmu.id",
    },
  },
  {
    id: "guru-1",
    nama: "Pak Budi Santoso, M.Pd",
    email: "budi.santoso@guru.id",
    password: "123",
    role: "guru",
    status: "approved",
    infoTambahan: "Guru Fisika & Matematika",
    waktuDaftar: "11 Okt 2026",
    xp: 980,
    aksesMengajar: ["sd-1", "smp-7", "sma-11-ipa", "sma-12-ipa", "pt-ti"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format&fit=crop&q=80",
      headline: "Pendidik Sains, Instruktur Olimpiade & Kontributor Wakaf Ilmu",
      bioSingkat: "Berdedikasi membagikan modul pembelajaran Fisika dan Matematika secara gratis.",
      asalSekolahKampus: "SMA Negeri 1 Unggulan",
      pendidikanTerakhir: "Magister Pendidikan Fisika (M.Pd)",
      skills: ["Fisika Mekanika", "Matematika Aljabar", "LaTeX", "Pembina OSN"],
      pengalaman: ["Guru Fisika Senior (2018 - Sekarang)"],
      prestasi: ["Guru Berprestasi Tingkat Nasional 2025"],
      portfolioUrl: "https://hibahilmu.id",
    },
  },
  {
    id: "siswa-1",
    nama: "Aisyah Putri",
    email: "aisyah@siswa.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswa Kelas 11 SMA",
    waktuDaftar: "12 Okt 2026",
    xp: 640,
    minatSubJenjang: ["sma-11-ipa", "pt-ti"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      headline: "Pelajar SMA Kelas 11 MIPA & Antusias Sains-Teknologi",
      bioSingkat: "Senang mempelajari Fisika Terapan, Pemrograman Web, dan aktif di klub riset remaja.",
      asalSekolahKampus: "SMA Harapan Bangsa",
      pendidikanTerakhir: "SMA Kelas 11 MIPA",
      skills: ["Fisika Dasar", "Matematika", "Public Speaking", "Python Dasar"],
      pengalaman: ["Ketua Kelompok Ilmiah Remaja (KIR) 2025"],
      prestasi: ["Juara 2 Olimpiade Sains Kota 2025", "Skor Terbaik Tryout TPA HibahIlmu"],
      portfolioUrl: "https://github.com",
      karyaPublik: [
        {
          id: "kr-1",
          judulKarya: "Simulasi Gerak Parabola & Hukum Newton Berbasis Python",
          kategori: "Proyek Sains & Fisika",
          deskripsi: "Visualisasi lintasan peluru dengan memperhitungkan percepatan gravitasi.",
          linkKarya: "https://github.com",
          tanggal: "19 Okt 2026",
        },
      ],
    },
  },
];

export const BANK_SOAL_KOLEKTIF_AWAL: SoalTryout[] = [
  {
    id: "bank-1",
    pertanyaan: "Hasil integral tak tentu dari f(x) = 4x³ adalah...",
    rumus: "\\int 4x^3 \\, dx = x^4 + C",
    opsi: ["x⁴ + C", "12x² + C", "4x⁴ + C", "2x³ + C"],
    jawabanBenar: 0,
    pembahasan: "Integral 4x³ dx = (4 / (3+1)) x^(3+1) + C = x⁴ + C.",
    penyumbangNama: "Pak Budi Santoso, M.Pd",
  },
];

export const TUGAS_AWAL: TugasItem[] = [
  {
    id: "tgs-1",
    subJenjangId: "sma-11-ipa",
    judul: "Latihan Mandiri: Analisis Hukum II Newton pada Bidang Miring",
    instruksi:
      "Tuliskan analisis hubungan gaya berat dan gaya normal pada benda di bidang miring 30 derajat beserta rujukan rumusnya.",
    deadline: "28 Okt 2026, 23:59 WIB",
    pembuatNama: "Pak Budi Santoso, M.Pd",
    kriteriaRubrik: ["Kedalaman Argumen (40%)", "Tata Bahasa (30%)", "Referensi/Rumus (30%)"],
  },
];

export const PENGUMPULAN_AWAL: PengumpulanTugas[] = [
  {
    id: "sub-1",
    tugasId: "tgs-1",
    siswaId: "siswa-1",
    siswaNama: "Aisyah Putri",
    jawabanTeksAtauLink:
      "Menurut referensi mekanika klasik, rumus gaya dorong sejajar bidang miring adalah F = m * g * sin(30). Jika massa 5 kg maka percepatan a = 4 m/s2. Link dokumen: https://drive.google.com/contoh-jawaban",
    waktuKumpul: "19 Okt 2026, 14:20",
    nilai: 95,
    feedbackGuru: "Perhitungan dan penurunan rumus sangat rapi, Aisyah! Pertahankan.",
  },
];

export const JADWAL_LIVE_AWAL: JadwalLiveItem[] = [
  {
    id: "live-1",
    judulSesi: "Bedah Tuntas Soal UTBK SNBT & Strategi Lulus PTN Impian",
    pengajarNama: "Pak Budi Santoso, M.Pd",
    tanggalJam: "Sabtu, 24 Okt 2026 • 19:00 WIB",
    meetingUrl: "https://meet.google.com",
    targetKelas: "SMA Kelas 12 & Umum",
  },
];

export const STUDY_ROOMS_AWAL: StudyRoomItem[] = [
  {
    id: "sr-1",
    namaGrup: "Pejuang Olimpiade Fisika & UTBK 2026",
    topikFokus: "Mekanika Klasik & Penalaran Kuantitatif",
    kodeUndangan: "FISIKA26",
    pembuatNama: "Aisyah Putri",
    anggotaNama: ["Aisyah Putri", "Dimas Anggara"],
    catatanBersama:
      "Target minggu ini: Menyelesaikan rangkuman Hukum Newton dan latihan 15 soal TPA Deret Angka.",
    pesanDiskusi: [
      {
        pengirim: "Aisyah Putri",
        isi: "Teman-teman, jangan lupa nanti malam kita bahas soal nomor 2 ya!",
        waktu: "16:30 WIB",
      },
    ],
  },
];

export const BEASISWA_AWAL: PengajuanBeasiswaItem[] = [
  {
    id: "bea-1",
    pemohonId: "siswa-1",
    pemohonNama: "Aisyah Putri",
    jenisBeasiswa: "Beasiswa Prestasi Sains",
    alasanPengajuan:
      "Aktif mempertahankan nilai rata-rata rapor di atas 90 dan membutuhkan dukungan buku referensi olimpiade.",
    nilaiRataRata: 95,
    status: "Disetujui",
    tanggalAjuan: "18 Okt 2026",
  },
];

export const NOTIF_AWAL: NotifikasiItem[] = [
  {
    id: "notif-1",
    targetUserId: "siswa-1",
    judul: "Selamat Datang di HibahIlmu.id!",
    pesan: "Akun belajar Anda telah aktif. Seluruh modul video dan tryout dapat diakses 100% gratis.",
    pengirim: "Sistem HibahIlmu",
    waktu: "Baru saja",
    dibaca: false,
  },
];

export const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "Hari ini, 08:30",
    namaPelaku: "Pak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mempublikasikan RPP Kurikulum Merdeka & Paket Tryout TPA",
    kategori: "materi",
  },
];

export const KELOMPOK_AWAL: KelompokBelajar[] = [
  {
    id: "klp-1",
    namaKelas: "Rombel Fisika SMA Kelas 11 Unggulan",
    pengumuman: "Jangan lupa kerjakan Latihan Mandiri Hukum II Newton sebelum hari Rabu ya!",
    guruId: "guru-1",
    siswaIds: ["siswa-1"],
  },
];

export const DISKUSI_PR_AWAL: DiskusiPR[] = [
  {
    id: "pr-1",
    penanya: "Aisyah Putri",
    jenjang: "SMA / SMK",
    mapel: "Fisika",
    judul: "Cara cepat membedakan Hukum I dan Hukum II Newton",
    pertanyaan: "Bagaimana cara menentukan sigma F = 0 pada soal katrol dan bidang miring?",
    waktu: "1 jam lalu",
    likes: 5,
    solved: true,
    jawaban: [],
  },
];

export const DATA_TRANSPARANSI_DONASI: TransparansiDonasi = {
  totalTerkumpul: 45000000,
  targetTahunan: 100000000,
  alokasiPenggunaan: [
    { kategori: "Server & Infrastruktur Cloud LMS", persentase: 40, nominal: 18000000 },
    { kategori: "Beasiswa Kuota Internet Pelajar", persentase: 35, nominal: 15750000 },
    { kategori: "Insentif Guru Relawan & Pembuat Modul", persentase: 25, nominal: 11250000 },
  ],
  riwayatDonatur: [
    {
      id: "don-1",
      namaDonatur: "Bapak H. Abdullah",
      nominal: 500000,
      pesan: "Semoga bermanfaat untuk pengembangan platform pendidikan anak bangsa.",
      waktu: "Kemarin",
    },
  ],
};