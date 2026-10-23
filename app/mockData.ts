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
    nama: "TK & PAUD",
    tagline: "3 TINGKAT KELAS",
    deskripsi: "Mengenal huruf, angka, warna, dan budi pekerti lewat animasi interaktif yang ceria.",
    gradien: "from-pink-500 to-rose-500",
    badge: "bg-pink-100 text-pink-800 border-pink-200",
    ikonNama: "Baby",
    subJenjang: [
      { id: "tk-a", nama: "TK Kecil (TK A)" },
      { id: "tk-b", nama: "TK Besar (TK B)" },
      { id: "paud", nama: "PAUD Terpadu" },
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
        syaratSkorMinimal: 70,
        durasi: "10 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Lima huruf vokal utama adalah <b>A, I, U, E, dan O</b>. Anak-anak diajak menyanyikan lagu huruf sambil menghitung jumlah buah apel.</p>",
        daftarBab: [
          {
            id: "bab-tk-1",
            judulBab: "Bab 1: Lagu Huruf Vokal A-I-U-E-O",
            durasiBab: "5 Menit",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            kontenHtml: "<p>Mari mengenal 5 huruf vokal dasar beserta contoh benda di sekitar kita.</p>",
          },
          {
            id: "bab-tk-2",
            judulBab: "Bab 2: Berhitung Buah Apel 1 sampai 10",
            durasiBab: "5 Menit",
            kontenHtml: "<p>Jika ada 3 apel merah ditambah 2 apel hijau, maka semuanya berjumlah 5 apel.</p>",
          },
        ],
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
    nama: "SD / MI",
    tagline: "6 TINGKAT KELAS",
    deskripsi: "Matematika dasar, eksperimen sains seru, Bahasa Indonesia & kisah inspiratif.",
    gradien: "from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    ikonNama: "Shapes",
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
        subJenjangId: "sd-1",
        judul: "Operasi Hitung Penjumlahan & Pengurangan Cepat",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "14 Okt 2026",
        level: "Pemula",
        syaratSkorMinimal: 75,
        durasi: "15 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Penjumlahan adalah menggabungkan sekelompok bilangan menjadi satu jumlah terbaru.</p>",
        rumusMatematika: "a + b = c \\quad \\text{dan} \\quad c - b = a",
        daftarBab: [
          {
            id: "bab-sd-1",
            judulBab: "Bab 1: Konsep Penjumlahan Bilangan Bulat",
            durasiBab: "8 Menit",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            kontenHtml: "<p>Penjumlahan dilakukan dengan menambahkan nilai satuan dengan satuan, puluhan dengan puluhan.</p>",
            rumusMatematika: "12 + 8 = 20",
          },
          {
            id: "bab-sd-2",
            judulBab: "Bab 2: Teknik Pengurangan & Soal Cerita",
            durasiBab: "7 Menit",
            kontenHtml: "<p>Pengurangan merupakan kebalikan dari operasi penjumlahan.</p>",
          },
        ],
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
    tagline: "3 TINGKAT KELAS",
    deskripsi: "Aljabar, Fisika terapan, Biologi sel, Bahasa Inggris, dan IPS Terpadu.",
    gradien: "from-blue-500 to-indigo-600",
    badge: "bg-blue-100 text-blue-900 border-blue-200",
    ikonNama: "Compass",
    subJenjang: [
      { id: "smp-7", nama: "Kelas 7 SMP" },
      { id: "smp-8", nama: "Kelas 8 SMP" },
      { id: "smp-9", nama: "Kelas 9 SMP" },
    ],
    kelas: [
      {
        id: "materi-smp-1",
        subJenjangId: "smp-7",
        judul: "Persamaan Linear Satu Variabel (Aljabar Dasar)",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "15 Okt 2026",
        level: "Menengah",
        syaratSkorMinimal: 75,
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
    gradien: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
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
        judul: "Modul 1: Hukum II Newton, Energi Kinetik & Dinamika Partikel",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "16 Okt 2026",
        level: "Menengah",
        syaratSkorMinimal: 80,
        durasi: "25 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        lampiranUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        rangkuman:
          "<h3>Konsep Dasar Hukum II Newton</h3><p>Percepatan sebuah benda berbanding lurus dengan gaya total yang bekerja padanya dan berbanding terbalik dengan massanya.</p>",
        rumusMatematika: "\\sum F = m \\cdot a \\quad \\text{dan} \\quad E_k = \\frac{1}{2} m v^2",
        daftarBab: [
          {
            id: "bab-sma-1",
            judulBab: "Bab 1: Hukum I, II, dan III Newton tentang Gerak",
            durasiBab: "12 Menit",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            kontenHtml:
              "<p>Hukum II Newton menyatakan bahwa <b>Resultan Gaya (ΣF)</b> sama dengan hasil kali massa benda (m) dan percepatannya (a).</p>",
            rumusMatematika: "\\sum F = m \\cdot a",
          },
          {
            id: "bab-sma-2",
            judulBab: "Bab 2: Usaha, Energi Kinetik, dan Energi Potensial",
            durasiBab: "13 Menit",
            kontenHtml:
              "<p>Energi kinetik adalah energi yang dimiliki benda karena kecepatannya (v).</p>",
            rumusMatematika: "E_k = \\frac{1}{2} m v^2",
          },
        ],
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
            komentar: "Penjelasan per bab ala Coursera/NetAcad dan fitur Audiobook-nya sangat membantu!",
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
          {
            id: "kuis-sma-2",
            tipe: "mencocokkan",
            tanya: "Pasangkan besaran fisika berikut dengan satuan SI yang tepat!",
            opsi: [],
            jawabanBenar: 0,
            pasangan: [
              { kiri: "Gaya (Force)", kanan: "Newton (N)" },
              { kiri: "Energi Kinetik", kanan: "Joule (J)" },
            ],
            pembahasan: "Satuan Gaya adalah Newton dan satuan Energi adalah Joule.",
            poin: 50,
          },
        ],
      },
      {
        id: "materi-sma-2",
        subJenjangId: "sma-12-ipa",
        judul: "Modul 2: Fisika Modern, Relativitas Khusus & Efek Fotolistrik",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "18 Okt 2026",
        level: "Mahir",
        prasyaratKelasId: "materi-sma-1",
        syaratSkorMinimal: 80,
        durasi: "30 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Modul tingkat lanjut ini memerlukan kelulusan dari <b>Modul 1: Hukum II Newton & Energi Kinetik</b> dengan nilai kuis minimal <b>80/100</b> terlebih dahulu.</p>",
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
    deskripsi: "Komunikasi Data, Big Data, AI, Penulisan Ilmiah, dan Persiapan Kerja.",
    gradien: "from-purple-600 to-violet-700",
    badge: "bg-purple-100 text-purple-900 border-purple-200",
    ikonNama: "GraduationCap",
    subJenjang: [
      { id: "pt-ti", nama: "Teknik Informatika & Jaringan" },
      { id: "pt-riset", nama: "Metodologi Riset & Jurnal" },
    ],
    kelas: [
      {
        id: "materi-komdat-1",
        subJenjangId: "pt-ti",
        judul: "Modul 1: Komunikasi Data Dasar (OSI Layer & TCP/IP)",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "20 Okt 2026",
        level: "Pemula",
        syaratSkorMinimal: 80,
        durasi: "25 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p><b>Model OSI (Open Systems Interconnection)</b> terdiri dari 7 lapisan utama mulai dari Physical Layer hingga Application Layer. Selesaikan kuis modul ini dengan nilai minimal 80 untuk membuka Modul 2: Komunikasi Data Lanjut.</p>",
        daftarBab: [
          {
            id: "bab-kd-1",
            judulBab: "Bab 1: Arsitektur 7 Layer OSI & Enkapsulasi Data",
            durasiBab: "12 Menit",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            kontenHtml:
              "<p>Model referensi <b>OSI 7 Layer</b> membagi komunikasi jaringan menjadi 7 tahapan: Physical, Data Link, Network, Transport, Session, Presentation, dan Application.</p>",
          },
          {
            id: "bab-kd-2",
            judulBab: "Bab 2: Protokol TCP/IP, Pengalamatan IPv4 & Subnetting",
            durasiBab: "13 Menit",
            kontenHtml:
              "<p>Pada lapisan Transport, protokol <b>TCP</b> menjamin pengiriman paket secara andal (connection-oriented), sedangkan <b>UDP</b> bersifat cepat tanpa koneksi (connectionless).</p>",
          },
        ],
        flashcards: [
          { id: "fc-kd-1", depan: "Jumlah Layer pada Model OSI", belakang: "7 Lapisan (Physical s/d Application)" },
          { id: "fc-kd-2", depan: "Perbedaan utama TCP vs UDP", belakang: "TCP: Connection-Oriented (Andal) | UDP: Connectionless (Cepat)" },
        ],
        daftarKuis: [
          {
            id: "kuis-kd-1",
            tipe: "pilihan_ganda",
            tanya: "Berapakah jumlah lapisan (layer) pada model referensi OSI?",
            opsi: ["4 Lapisan", "5 Lapisan", "7 Lapisan", "8 Lapisan"],
            jawabanBenar: 2,
            pembahasan: "Model OSI memiliki 7 lapisan standar internasional.",
            poin: 50,
          },
          {
            id: "kuis-kd-2",
            tipe: "benar_salah",
            tanya: "Benar atau Salah: Protokol TCP bersifat connection-oriented dan menjamin keandalan pengiriman data?",
            opsi: ["Benar", "Salah"],
            jawabanBenar: 0,
            pembahasan: "Benar, TCP melakukan three-way handshake untuk menjamin keandalan paket.",
            poin: 50,
          },
        ],
      },
      {
        id: "materi-komdat-2",
        subJenjangId: "pt-ti",
        judul: "Modul 2: Komunikasi Data Lanjut (Routing OSPF, BGP & Keamanan Jaringan)",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "21 Okt 2026",
        level: "Menengah",
        prasyaratKelasId: "materi-komdat-1",
        syaratSkorMinimal: 80,
        durasi: "35 Menit",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        rangkuman:
          "<p>Modul menengah ini membahas <b>Dynamic Routing (OSPF & BGP)</b> serta keamanan paket data. Modul ini baru terbuka setelah Anda lulus <b>Modul 1: Komunikasi Data Dasar</b> dengan nilai minimal 80.</p>",
        daftarBab: [
          {
            id: "bab-kdl-1",
            judulBab: "Bab 1: Konsep Dynamic Routing & Algoritma Dijkstra (OSPF)",
            durasiBab: "15 Menit",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            kontenHtml:
              "<p><b>OSPF (Open Shortest Path First)</b> adalah protokol routing link-state yang menggunakan algoritma Shortest Path First (Dijkstra) untuk menentukan jalur tercepat.</p>",
          },
          {
            id: "bab-kdl-2",
            judulBab: "Bab 2: Konfigurasi Firewall, VLAN & Mitigasi Serangan Jaringan",
            durasiBab: "20 Menit",
            kontenHtml:
              "<p>Segmentasi jaringan menggunakan <b>VLAN (Virtual LAN)</b> meningkatkan keamanan dan efisiensi broadcast domain pada infrastruktur skala enterprise.</p>",
          },
        ],
        daftarKuis: [
          {
            id: "kuis-kdl-1",
            tipe: "pilihan_ganda",
            tanya: "Algoritma apakah yang digunakan oleh protokol routing OSPF untuk mencari jalur terpendek?",
            opsi: ["Bellman-Ford", "Dijkstra (SPF)", "Bubble Sort", "RSA Encryption"],
            jawabanBenar: 1,
            pembahasan: "OSPF menggunakan algoritma Dijkstra (Shortest Path First).",
            poin: 75,
          },
        ],
      },
      {
        id: "materi-pt-1",
        subJenjangId: "pt-ti",
        judul: "Modul 3: Arsitektur Big Data (Kafka, Flume, Sqoop) & Reinforcement Learning",
        pembuatId: "guru-1",
        pembuatNama: "Bapak Budi Santoso, M.Pd",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: "17 Okt 2026",
        level: "Mahir",
        prasyaratKelasId: "materi-komdat-2",
        syaratSkorMinimal: 80,
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
    pembuatNama: "Bapak Budi Santoso, M.Pd",
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
    pembuatNama: "Bapak Budi Santoso, M.Pd",
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
    pembuatNama: "Bapak Budi Santoso, M.Pd",
    ringkasanTujuan: "Siswa mampu menganalisis hubungan gaya, massa, dan percepatan melalui eksperimen.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    jumlahUnduhan: 142,
    tanggalUpload: "15 Okt 2026",
  },
  {
    id: "rpp-2",
    judulRpp: "RPS (Rencana Pembelajaran Semester): Komunikasi Data & Sistem Big Data",
    mataPelajaran: "Teknik Informatika",
    jenjangKelas: "Semester 5 Kuliah",
    kurikulum: "Silabus Kampus / RPS",
    pembuatNama: "Bapak Budi Santoso, M.Pd",
    ringkasanTujuan: "Mahasiswa mampu merancang topologi jaringan OSPF, pipeline Apache Kafka, dan Q-Learning.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    jumlahUnduhan: 89,
    tanggalUpload: "18 Okt 2026",
  },
];

export const OFFICE_HOURS_AWAL: OfficeHourItem[] = [
  {
    id: "oh-1",
    namaAhli: "Bapak Budi Santoso, M.Pd",
    keahlian: "Pakar Fisika, Jaringan & Persiapan SNBT/TPA",
    topikBahasan: "Klinik Bedah Soal Mekanika, Subnetting & Strategi Tembus Skor TPA 600+",
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
    nama: "Admin Panda Kode",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "approved",
    infoTambahan: "Founder & Super Admin HibahIlmu",
    waktuDaftar: "10 Okt 2026",
    xp: 1500,
    aksesMengajar: ["ALL"],
    cv: {
      fotoUrl: "",
      headline: "Founder & Super Admin HibahIlmu",
      bioSingkat: "Mengelola infrastruktur AI EdTech dan kualitas konten pembelajaran terbuka.",
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
    nama: "Bapak Budi Santoso, M.Pd",
    email: "guru@hibahilmu.id",
    password: "123",
    role: "guru",
    status: "approved",
    infoTambahan: "Guru Fisika, Matematika & Jaringan",
    waktuDaftar: "11 Okt 2026",
    xp: 980,
    aksesMengajar: ["sd-1", "smp-7", "sma-11-ipa", "sma-12-ipa", "pt-ti"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format&fit=crop&q=80",
      headline: "Pendidik Sains, Instruktur Jaringan & Kontributor Wakaf Ilmu",
      bioSingkat: "Berdedikasi membagikan modul pembelajaran berurutan ala NetAcad secara gratis.",
      asalSekolahKampus: "SMA Negeri 1 Unggulan",
      pendidikanTerakhir: "Magister Pendidikan (M.Pd)",
      skills: ["Fisika Mekanika", "Komunikasi Data", "LaTeX", "Pembina OSN"],
      pengalaman: ["Pengajar Senior (2018 - Sekarang)"],
      prestasi: ["Pendidik Inspiratif Nasional 2025"],
      portfolioUrl: "https://hibahilmu.id",
    },
  },
  {
    id: "siswa-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "123",
    role: "siswa",
    status: "approved",
    infoTambahan: "Siswa Kelas 11 SMA & Antusias IT",
    waktuDaftar: "12 Okt 2026",
    xp: 640,
    minatSubJenjang: ["sma-11-ipa", "sma-12-ipa", "pt-ti"],
    cv: {
      fotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      headline: "Pelajar SMA Kelas 11 MIPA & Antusias Sains-Teknologi",
      bioSingkat: "Senang mempelajari Fisika Terapan, Jaringan Komputer, dan aktif di klub riset remaja.",
      asalSekolahKampus: "SMA Harapan Bangsa",
      pendidikanTerakhir: "SMA Kelas 11 MIPA",
      skills: ["Fisika Dasar", "Komunikasi Data", "Public Speaking", "Python Dasar"],
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
    rumus: "TPA Verbal - Antonim",
    pertanyaan: "ANTONIM dari kata 'SPORADIS' adalah...",
    opsi: ["Jarang", "Kerap / Terus-menerus", "Terpisah", "Lambat"],
    jawabanBenar: 1,
    pembahasan: "Sporadis berarti kadang-kadang atau jarang terjadi, sehingga lawan katanya (antonim) adalah kerap atau terus-menerus.",
    penyumbangNama: "Bapak Budi Santoso, M.Pd",
  },
  {
    id: "bank-2",
    rumus: "Artificial Intelligence & Machine Learning",
    pertanyaan: "Dalam Reinforcement Learning, fungsi yang mengevaluasi seberapa baik suatu state-action pair disebut...",
    opsi: ["Loss Function", "Q-Value Function Q(s,a)", "Activation ReLU", "Dropout Layer"],
    jawabanBenar: 1,
    pembahasan: "Action-Value Function atau Q(s,a) menghitung ekspektasi kumulatif reward dari mengambil aksi a pada state s.",
    penyumbangNama: "Admin Panda Kode",
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
    pembuatNama: "Bapak Budi Santoso, M.Pd",
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
    judulSesi: "Bedah Tuntas Soal UTBK SNBT & Konsep Dasar Jaringan Cisco NetAcad",
    pengajarNama: "Bapak Budi Santoso, M.Pd",
    tanggalJam: "Sabtu, 24 Okt 2026 • 19:00 WIB",
    meetingUrl: "https://meet.google.com",
    targetKelas: "SMA Kelas 12 & Mahasiswa",
  },
];

export const STUDY_ROOMS_AWAL: StudyRoomItem[] = [
  {
    id: "sr-1",
    namaGrup: "Pejuang Olimpiade Sains & Jaringan 2026",
    topikFokus: "Mekanika Klasik & Komunikasi Data",
    kodeUndangan: "SAINS26",
    pembuatNama: "Aisyah Putri",
    anggotaNama: ["Aisyah Putri", "Dimas Anggara"],
    catatanBersama:
      "Target minggu ini: Lulus Modul 1 Komunikasi Data dengan nilai >= 80 agar Modul 2 terbuka.",
    pesanDiskusi: [
      {
        pengirim: "Aisyah Putri",
        isi: "Teman-teman, jangan lupa selesaikan kuis Bab 2 di pop-up modul ya!",
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
      "Aktif mempertahankan nilai rata-rata modul di atas 90 dan membutuhkan dukungan buku referensi.",
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
    pesan: "Akun belajar Anda telah aktif. Seluruh modul berurutan dan tryout dapat diakses 100% gratis.",
    pengirim: "Sistem HibahIlmu",
    waktu: "Baru saja",
    dibaca: false,
  },
];

export const LOG_AWAL: LogAktivitas[] = [
  {
    id: "log-1",
    waktu: "Hari ini, 08:30",
    namaPelaku: "Bapak Budi Santoso, M.Pd",
    rolePelaku: "guru",
    aksi: "Mempublikasikan Rantai Modul Komunikasi Data 1 & 2 (Syarat KKM 80)",
    kategori: "materi",
  },
];

export const KELOMPOK_AWAL: KelompokBelajar[] = [
  {
    id: "klp-1",
    namaKelas: "Rombel Sains & Jaringan Unggulan",
    pengumuman: "Pastikan lulus Modul 1 dengan skor minimal 80 untuk membuka Modul 2!",
    guruId: "guru-1",
    siswaIds: ["siswa-1"],
  },
];

export const DISKUSI_PR_AWAL: DiskusiPR[] = [
  {
    id: "pr-1",
    penanya: "Aisyah Putri",
    jenjang: "Perguruan Tinggi & SMA",
    mapel: "Komunikasi Data & Fisika",
    judul: "Perbedaan fungsi Layer Transport (TCP) dan Network (IP) pada OSI",
    pertanyaan: "Bagaimana proses enkapsulasi segmen menjadi paket saat melewati Layer 4 ke Layer 3?",
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
      pesan: "Semoga bermanfaat untuk pengembangan platform pendidikan gratis anak bangsa.",
      waktu: "Kemarin",
    },
  ],
};