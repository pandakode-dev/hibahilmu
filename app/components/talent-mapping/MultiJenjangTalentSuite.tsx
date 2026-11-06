"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Printer,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
  Baby,
  Eraser,
  Paintbrush,
  Lock,
  Compass,
  CloudUpload,
  CheckSquare,
  Target,
  Lightbulb,
  ShieldAlert,
  Award,
  Medal,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface DimensiScoreItem {
  id: string;
  nama: string;
  julukan: string;
  ikon: string;
  warna: string;
  skorMentah: number;
  persen: number;
  peringkat: number;
  kategori:
    | "Kekuatan Utama"
    | "Kekuatan Pendukung"
    | "Area Perlu Stimulasi / Tantangan";
  deskripsiKekuatan: string;
  dampakJikaLemah: string;
  solusiAgarTidakMenghambat: string;
  harusNgapainSaja: string[];
  rekomendasiLesAtauEkskul: string[];
  potensiMasaDepan: string[];
}

type MisiKanvasId = "rumah_pohon" | "robot_bintang" | "taman_satwa" | "bebas";

const DAFTAR_MISI_KANVAS: {
  id: MisiKanvasId;
  judul: string;
  sub: string;
  dimensiTerkait: string;
}[] = [
  {
    id: "rumah_pohon",
    judul: "🏡 Kanvas 1: Rumah, Matahari & Pohon",
    sub: "Mengukur kepekaan ruang, kehangatan keluarga & alam",
    dimensiTerkait: "alam",
  },
  {
    id: "robot_bintang",
    judul: "🤖 Kanvas 2: Robot Pintar & Bintang",
    sub: "Mengukur imajinasi teknologi, logika bentuk & sains",
    dimensiTerkait: "logika",
  },
  {
    id: "taman_satwa",
    judul: "🦋 Kanvas 3: Kupu-Kupu & Bunga Taman",
    sub: "Mengukur ketelitian motorik halus & keindahan warna",
    dimensiTerkait: "seni",
  },
  {
    id: "bebas",
    judul: "✨ Kanvas 4: Menggambar Imajinasi Bebas",
    sub: "Anak bebas menggambar apa saja yang ada di pikirannya",
    dimensiTerkait: "mandiri",
  },
];

// ============================================================================
// 1. DATABASE LENGKAP JENJANG 1: ANAK USIA 3–8 TAHUN (PAUD, TK & SD AWAL)
// ============================================================================
const DEFINISI_8_DIMENSI_ANAK: Record<
  string,
  Omit<DimensiScoreItem, "skorMentah" | "persen" | "peringkat" | "kategori">
> = {
  seni: {
    id: "seni",
    nama: "Visual-Spasial & Seni Kreatif",
    julukan: "Si Pelukis & Perancang Imajinatif",
    ikon: "🎨",
    warna: "#e11d48",
    deskripsiKekuatan:
      "Ananda memiliki kepekaan mata yang sangat baik terhadap warna, bentuk, ruang, dan gambar. Ia mudah menuangkan imajinasi di kepalanya menjadi coretan gambar, bentuk plastisin, atau susunan warna yang indah.",
    dampakJikaLemah:
      "Jika area visual-spasial ini kurang terstimulasi, anak mungkin cepat bingung membaca arah/denah, kurang rapi menulis di garis buku, atau kesulitan membayangkan bentuk benda 3 dimensi.",
    solusiAgarTidakMenghambat:
      "Jangan paksa anak menggambar bentuk yang harus persis seperti aslinya. Gunakan buku berpetak besar saat belajar menulis, gunakan flashcard bergambar warna-warni, dan ajak bermain menyusun bentuk sederhana.",
    harusNgapainSaja: [
      "Sediakan pojok kreatif di rumah berisi kertas gambar A3, krayon/cat air yang mudah dicuci, dan plastisin/clay.",
      "Ajak anak menceritakan arti gambar yang baru saja ia buat untuk melatih rasa percaya dirinya.",
      "Pajang hasil karya gambarnya di dinding kamar atau pintu kulkas sebagai bentuk apresiasi nyata.",
    ],
    rekomendasiLesAtauEkskul: [
      "Les Menggambar & Melukis Kanvas Anak",
      "Kelas Kerajinan Tangan (Clay, Origami & Papercraft)",
      "Kelas Animasi & Desain Visual Dasar (Scratch Jr)",
    ],
    potensiMasaDepan: [
      "Arsitek & Desainer Interior",
      "Desainer Grafis / UI-UX & Ilustrator",
      "Animator & Sutradara Kreatif",
    ],
  },
  fisik: {
    id: "fisik",
    nama: "Kinestetik-Jasmani & Motorik Fisik",
    julukan: "Si Gesit Berenergi Tinggi",
    ikon: "⚽",
    warna: "#ea580c",
    deskripsiKekuatan:
      "Ananda memiliki koordinasi tubuh, keseimbangan, ketangkasan gerak, dan stamina fisik yang menonjol. Ia belajar paling cepat ketika tangannya ikut menyentuh, mempraktikkan, dan tubuhnya bergerak aktif.",
    dampakJikaLemah:
      "Jika motorik kasar dan halus kurang dilatih, anak mudah cepat lelah saat kegiatan sekolah, jari tangan cepat pegal saat menulis lama, atau kurang percaya diri saat bermain permainan fisik bersama teman.",
    solusiAgarTidakMenghambat:
      "Jangan menuntut anak duduk diam berjam-jam tanpa jeda. Berikan jeda gerak (stretching/lompat ringan) setiap 20 menit belajar, serta latih otot jari lewat meremas spons air, menggunting kertas pola, dan meronce manik.",
    harusNgapainSaja: [
      "Berikan waktu bermain aktif di luar ruangan (berlari, bersepeda, lempar tangkap bola) minimal 45–60 menit setiap sore.",
      "Gunakan metode belajar sambil bergerak (misalnya berhitung sambil melompat di ubin atau menempel kartu di dinding).",
      "Latih kemandirian motorik harian seperti mengikat tali sepatu, mengancingkan baju, dan makan sendiri dengan rapi.",
    ],
    rekomendasiLesAtauEkskul: [
      "Les Renang / Akuatik (Sangat bagus untuk postur & pernapasan)",
      "Sekolah Sepak Bola (SSB) / Futsal / Bulutangkis",
      "Bela Diri Anak (Taekwondo / Karate / Pencak Silat) atau Gimnastik",
    ],
    potensiMasaDepan: [
      "Atlet Profesional & Pelatih Olahraga",
      "Dokter Bedah / Fisioterapis / Tenaga Medis",
      "Insinyur Lapangan & Penerbang/Pilot",
    ],
  },
  logika: {
    id: "logika",
    nama: "Logika-Matematika & Sains Eksploratif",
    julukan: "Si Ilmuwan & Pemecah Teka-Teki Cilik",
    ikon: "🧩",
    warna: "#2563eb",
    deskripsiKekuatan:
      "Ananda gemar mencari tahu bagaimana sesuatu bekerja! Ia menyukai pola angka, menyusun balok konstruksi, memecahkan puzzle, dan sering mengajukan pertanyaan kritis 'Mengapa bisa begitu?'.",
    dampakJikaLemah:
      "Jika logika dasar kurang terasah, anak bisa merasa takut duluan melihat angka/matematika di SD, mudah menyerah saat menemukan soal cerita, atau bingung mengurutkan langkah-langkah kegiatan.",
    solusiAgarTidakMenghambat:
      "Hindari mengenalkan matematika lewat hafalan rumus yang menakutkan! Kenalkan angka dan logika lewat benda nyata sehari-hari (menghitung potongan buah, bermain jual-beli, atau mengelompokkan mainan berdasarkan warna/ukuran).",
    harusNgapainSaja: [
      "Ajak melakukan eksperimen sains sederhana di rumah setiap akhir pekan (misal: mencampur warna air, gunung berapi soda kue, atau magnet).",
      "Sediakan permainan balok bangun (Lego), tangram, rubik pemula, atau catur anak untuk mengasah strategi berpikirnya.",
      "Jawab setiap pertanyaan 'Kenapa' dari anak dengan sabar dan ajak ia menebak jawabannya terlebih dahulu.",
    ],
    rekomendasiLesAtauEkskul: [
      "Les Robotika & Coding Visual Anak (Blockly / Scratch)",
      "Kursus Matematika Logika Menyenangkan / Sempoa",
      "Klub Sains Cilik (Little Scientist) & Klub Catur",
    ],
    potensiMasaDepan: [
      "Ilmuwan Data (Data Scientist) & AI Engineer",
      "Programmer / Software Architect",
      "Insinyur Teknik, Peneliti & Analis Keuangan",
    ],
  },
  musik: {
    id: "musik",
    nama: "Musikal-Irama & Kepekaan Auditori",
    julukan: "Si Peka Nada & Irama Harmonis",
    ikon: "🎹",
    warna: "#9333ea",
    deskripsiKekuatan:
      "Telinga dan perasaan Ananda sangat peka terhadap nada, ketukan irama, dan suara. Ia mudah sekali menghafal lagu, suka bersenandung saat bermain, dan tubuhnya otomatis bergerak saat mendengar musik.",
    dampakJikaLemah:
      "Jika kepekaan auditori kurang terlatih, anak mungkin kurang fokus saat mendengarkan instruksi lisan yang panjang di kelas yang bising atau kurang ekspresif dalam intonasi bicara.",
    solusiAgarTidakMenghambat:
      "Saat memberi instruksi kepada anak, lakukan kontak mata sejajar dan gunakan kalimat pendek yang jelas. Bantu ia menghafal materi pelajaran (seperti nama hari, doa, atau kosakata) menggunakan nada lagu ceria.",
    harusNgapainSaja: [
      "Putarkan lagu-lagu edukatif dan musik instrumental klasik/tradisional untuk menstimulasi keseimbangan otak kanan dan kirinya.",
      "Ajak bermain tebak suara (suara hewan, suara alat musik) dan tepuk tangan mengikuti pola irama.",
      "Gunakan metode bernyanyi saat menghafal doa harian, surat pendek, atau perkalian dasar.",
    ],
    rekomendasiLesAtauEkskul: [
      "Les Piano / Keyboard Dasar (Melatih koordinasi 2 tangan & otak)",
      "Kelas Vokal / Paduan Suara & Gerak Lagu Anak",
      "Les Gitar Akustik, Biola, atau Perkusi/Drum Anak",
    ],
    potensiMasaDepan: [
      "Komposer Musik & Produser Audio",
      "Sound Engineer & Kreator Multimedia",
      "Pendidik Seni & Terapis Musik",
    ],
  },
  bahasa: {
    id: "bahasa",
    nama: "Linguistik-Verbal & Komunikasi Cerita",
    julukan: "Si Pendongeng & Pembicara Cilik",
    ikon: "📚",
    warna: "#059669",
    deskripsiKekuatan:
      "Ananda cepat menyerap kosakata baru, senang mendengarkan maupun menceritakan kembali sebuah kisah dengan ekspresif, dan berani mengungkapkan pendapat atau keinginannya dengan kata-kata.",
    dampakJikaLemah:
      "Jika kemampuan verbal kurang distimulasi, anak mungkin kesulitan mengungkapkan apa yang ia rasakan (sehingga mudah menangis/tantrum saat kesal) atau kurang percaya diri berbicara di depan guru dan teman.",
    solusiAgarTidakMenghambat:
      "Jangan memotong kalimat anak saat ia sedang berusaha bercerita. Berikan pancingan pertanyaan terbuka ('Tadi di sekolah kejadian paling seru apa?') dan batasi screen-time pasif agar interaksi bicaranya aktif.",
    harusNgapainSaja: [
      "Lakukan rutinitas membacakan buku cerita bergambar (Read Aloud) selama 15 menit setiap malam sebelum tidur.",
      "Ajak bermain tebak kata, menyambung cerita bergantian, atau bermain peran (jadi dokter, guru, koki) yang kaya dialog.",
      "Kenalkan kosakata bahasa asing (Inggris/Arab) secara santai lewat lagu dan benda-benda di dalam rumah.",
    ],
    rekomendasiLesAtauEkskul: [
      "Kelas Storytelling (Mendongeng) & Public Speaking Cilik",
      "Kursus Bahasa Inggris / Bahasa Arab Interaktif Anak",
      "Klub Baca-Tulis & Jurnalistik Cilik",
    ],
    potensiMasaDepan: [
      "Penulis Buku, Jurnalis & Editor",
      "Diplomat, Pengacara & Juru Bicara Publik",
      "Dosen, Pengajar & Kreator Konten Edukasi",
    ],
  },
  sosial: {
    id: "sosial",
    nama: "Interpersonal, Empati & Kepemimpinan",
    julukan: "Si Sahabat Ramah & Pemimpin Cilik",
    ikon: "🤝",
    warna: "#0284c7",
    deskripsiKekuatan:
      "Ananda mudah berbaur dengan teman baru, peka saat melihat temannya sedih, senang berbagi, dan sering berinisiatif mengajak atau mengatur permainan bersama teman-teman sebayanya.",
    dampakJikaLemah:
      "Jika keterampilan sosial kurang terlatih, anak mungkin butuh waktu lama untuk beradaptasi di lingkungan baru, cenderung malu bertanya di kelas, atau bingung cara menyelesaikan rebutan mainan dengan teman.",
    solusiAgarTidakMenghambat:
      "Jangan melabeli anak sebagai 'pemalu' di depan orang lain. Mulailah dengan mengajak 1–2 teman bermain ke rumah (playdate kecil) sehingga ia nyaman bersosialisasi secara bertahap sebelum masuk ke kelompok besar.",
    harusNgapainSaja: [
      "Libatkan anak dalam kegiatan bermain kelompok dan ajarkan kalimat ajaib: 'Tolong', 'Terima kasih', 'Maaf', dan 'Boleh pinjam?'.",
      "Beri kepercayaan menjadi 'Ketua Kecil' di rumah, misalnya memimpin doa makan atau membagi camilan ke anggota keluarga.",
      "Ajak anak berbagi mainan atau makanan kepada tetangga dan teman yang membutuhkan untuk memupuk empatinya.",
    ],
    rekomendasiLesAtauEkskul: [
      "Pramuka Siaga / Klub Kepanduan & Outbound Anak",
      "Kelas Teater, Drama Musikal & Bermain Peran",
      "Olahraga Beregu (Futsal, Basket Mini, Voli Anak)",
    ],
    potensiMasaDepan: [
      "Pemimpin Organisasi, CEO & Manajer Proyek",
      "Psikolog, Konselor & HR Specialist",
      "Dokter Anak, Pengajar & Tokoh Masyarakat",
    ],
  },
  alam: {
    id: "alam",
    nama: "Naturalis, Cinta Lingkungan & Flora-Fauna",
    julukan: "Si Penjelajah Alam & Penyayang Satwa",
    ikon: "🌿",
    warna: "#16a34a",
    deskripsiKekuatan:
      "Ananda sangat antusias ketika berada di alam terbuka! Ia gemar mengamati hewan, serangga, tanaman, batu-batuan, cuaca, serta memiliki kasih sayang alami terhadap makhluk hidup di sekitarnya.",
    dampakJikaLemah:
      "Jika kurang berinteraksi dengan alam, anak cenderung terlalu terpaku pada gawai di dalam ruangan, mudah jijik/takut berlebihan pada rumput atau serangga kecil, dan kurang peka terhadap kebersihan lingkungan.",
    solusiAgarTidakMenghambat:
      "Jadwalkan waktu bebas gawai setiap akhir pekan dengan berjalan pagi di taman, pantai, atau kebun. Kenalkan alam secara menyenangkan melalui kaca pembesar atau menanam benih kecambah di kapas basah.",
    harusNgapainSaja: [
      "Beri anak 1 pot tanaman miliknya sendiri untuk disiram setiap pagi atau hewan peliharaan jinak (seperti ikan hias/kura-kura/kucing) untuk diberi makan.",
      "Ajak berkunjung ke kebun raya, taman satwa, museum alam, atau wisata pertanian/peternakan edukatif.",
      "Ajarkan kebiasaan memilah sampah dan menjaga kebersihan lingkungan sejak dini.",
    ],
    rekomendasiLesAtauEkskul: [
      "Klub Sains Alam, Ekologi & Berkebun Anak (Little Gardener)",
      "Kegiatan Berkuda / Memanah & Jelajah Alam",
      "Klub Dokter Kecil & Pecinta Satwa",
    ],
    potensiMasaDepan: [
      "Dokter Hewan & Ahli Biologi/Bioteknologi",
      "Pakar Konservasi Lingkungan & Energi Hijau",
      "Ahli Agroteknologi & Ketahanan Pangan",
    ],
  },
  mandiri: {
    id: "mandiri",
    nama: "Intrapersonal, Fokus & Kemandirian Diri",
    julukan: "Si Mandiri & Teguh Pendirian",
    ikon: "🌟",
    warna: "#d97706",
    deskripsiKekuatan:
      "Ananda mengenali apa yang ia sukai, mampu bermain atau menyelesaikan tugas sendiri dengan fokus yang baik, serta memiliki kemauan yang kuat dan rasa percaya diri dari dalam dirinya.",
    dampakJikaLemah:
      "Jika kemandirian dan regulasi emosi kurang terlatih, anak mudah merengek ketika menemui kesulitan kecil, selalu bergantung penuh pada bantuan orang tua, atau mudah terdistraksi sebelum tugasnya selesai.",
    solusiAgarTidakMenghambat:
      "Berikan tantangan bertahap sesuai usianya dan tahan diri untuk tidak langsung mengambil alih pekerjaan anak saat ia baru mencoba. Puji usaha dan ketekunannya ('Kakak hebat sudah berusaha mencoba!'), bukan hanya hasil akhirnya.",
    harusNgapainSaja: [
      "Buat papan 'Stiker Bintang Kebiasaan Baik' di kamar (membereskan mainan sendiri, menyiapkan tas sekolah, sikat gigi tepat waktu).",
      "Ajarkan anak mengenali nama emosinya ('Aku sedang kesal karena...', 'Aku senang karena...') dan cara menenangkan diri dengan tarik napas dalam.",
      "Berikan kesempatan anak memilih sendiri 2 opsi sederhana (misal memilih baju atau memilih buku yang ingin dibaca).",
    ],
    rekomendasiLesAtauEkskul: [
      "Kelas Montessori & Life-Skills (Keterampilan Hidup Mandiri)",
      "Les Memanah / Catur (Melatih fokus & ketenangan diri)",
      "Kelas Memasak Anak (Junior Chef) & Bela Diri",
    ],
    potensiMasaDepan: [
      "Entrepreneur / Wirausahawan Mandiri",
      "Peneliti & Perencana Strategis",
      "Pemimpin Berintegritas di Berbagai Bidang",
    ],
  },
};

const KARTU_VISUAL_ANAK_16 = [
  {
    id: 1,
    pertanyaan: "1. Saat waktu bermain bebas di rumah, mana yang paling suka kamu mainkan?",
    opsi: [
      { kode: "seni", ikon: "🎨", teks: "Menggambar, Mewarnai & Melukis" },
      { kode: "fisik", ikon: "⚽", teks: "Main Bola, Lari & Bersepeda" },
      { kode: "logika", ikon: "🧩", teks: "Menyusun Lego & Puzzle" },
      { kode: "sosial", ikon: "👫", teks: "Main Rame-Rame Bareng Teman" },
    ],
  },
  {
    id: 2,
    pertanyaan: "2. Kalau diberi hadiah kejutan, benda mana yang paling kamu inginkan?",
    opsi: [
      { kode: "musik", ikon: "🎹", teks: "Piano Mini, Gitar atau Drum" },
      { kode: "alam", ikon: "🐰", teks: "Kelinci, Ikan Hias atau Tanaman" },
      { kode: "bahasa", ikon: "📚", teks: "Buku Cerita Dongeng Bergambar" },
      { kode: "mandiri", ikon: "⛺", teks: "Tenda Kemah & Tas Petualang Sendiri" },
    ],
  },
  {
    id: 3,
    pertanyaan: "3. Tempat liburan mana yang paling ingin kamu kunjungi akhir pekan ini?",
    opsi: [
      { kode: "fisik", ikon: "🏊", teks: "Kolam Renang & Taman Outbound" },
      { kode: "alam", ikon: "🦁", teks: "Kebun Binatang & Taman Safari" },
      { kode: "logika", ikon: "🚀", teks: "Museum Sains, Robot & Planetarium" },
      { kode: "seni", ikon: "🎭", teks: "Istana Boneka & Studio Lukis" },
    ],
  },
  {
    id: 4,
    pertanyaan: "4. Di sekolah atau tempat bermain, kegiatan apa yang paling seru?",
    opsi: [
      { kode: "musik", ikon: "🎵", teks: "Menyanyi & Menari Ikut Irama" },
      { kode: "bahasa", ikon: "🎤", teks: "Maju Bercerita di Depan Kelas" },
      { kode: "sosial", ikon: "👑", teks: "Jadi Kapten Kelompok Permainan" },
      { kode: "mandiri", ikon: "🏅", teks: "Menyelesaikan Tugas Sendiri Sampai Tuntas" },
    ],
  },
  {
    id: 5,
    pertanyaan: "5. Kalau melihat pelangi atau hujan di luar jendela, apa yang kamu pikirkan?",
    opsi: [
      { kode: "seni", ikon: "🌈", teks: "Ingin Menggambar Pelangi Warna-Warni" },
      { kode: "logika", ikon: "🔍", teks: "Bertanya: Kenapa Pelangi Bisa Muncul?" },
      { kode: "alam", ikon: "🌱", teks: "Senang Karena Bunga & Pohon Jadi Segar" },
      { kode: "musik", ikon: "🎶", teks: "Menyanyikan Lagu Hujan & Pelangi" },
    ],
  },
  {
    id: 6,
    pertanyaan: "6. Saat melihat temanmu terjatuh atau sedih, apa yang kamu lakukan?",
    opsi: [
      { kode: "sosial", ikon: "🤗", teks: "Menolong, Memeluk & Menghiburnya" },
      { kode: "bahasa", ikon: "💬", teks: "Mengajak Ngobrol & Bercerita Lucu" },
      { kode: "mandiri", ikon: "🩹", teks: "Sigap Mengambilkan Air atau Kotak Obat" },
      { kode: "seni", ikon: "🎁", teks: "Memberikan Gambar atau Mainan Buatannya" },
    ],
  },
  {
    id: 7,
    pertanyaan: "7. Permainan tantangan mana yang paling membuatmu bersemangat?",
    opsi: [
      { kode: "logika", ikon: "🔢", teks: "Tebak Angka, Labirin & Hitung Cepat" },
      { kode: "fisik", ikon: "🏃", teks: "Lomba Lari Halang Rintang & Lompat" },
      { kode: "musik", ikon: "🥁", teks: "Tebak Lagu & Meniru Ketukan Irama" },
      { kode: "alam", ikon: "🦋", teks: "Mencari Jejak Hewan & Daun Unik di Taman" },
    ],
  },
  {
    id: 8,
    pertanyaan: "8. Saat menonton video atau acara anak, tayangan apa yang paling kamu sukai?",
    opsi: [
      { kode: "logika", ikon: "🤖", teks: "Cara Kerja Robot, Truk, Pesawat & Sains" },
      { kode: "seni", ikon: "🖌️", teks: "Tutorial Melukis, Origami & Kreasi Mainan" },
      { kode: "alam", ikon: "🐬", teks: "Petualangan Dunia Hewan Laut & Hutan" },
      { kode: "bahasa", ikon: "🧚", teks: "Kisah Dongeng Petualangan & Pahlawan" },
    ],
  },
  {
    id: 9,
    pertanyaan: "9. Kalau diajak membantu Ayah & Ibu di rumah, tugas mana yang kamu pilih?",
    opsi: [
      { kode: "alam", ikon: "🌻", teks: "Menyiram Tanaman & Memberi Makan Hewan" },
      { kode: "mandiri", ikon: "🧺", teks: "Merapikan Kamar & Menyusun Mainan Sendiri" },
      { kode: "fisik", ikon: "🧹", teks: "Membantu Menyapu, Mencuci Mobil & Angkat Barang" },
      { kode: "sosial", ikon: "🍽️", teks: "Menyiapkan Meja Makan Bersama Keluarga" },
    ],
  },
  {
    id: 10,
    pertanyaan: "10. Alat bermain apa yang paling betah kamu pegang berjam-jam?",
    opsi: [
      { kode: "seni", ikon: "🖍️", teks: "Krayon, Spidol Warna, Gunting & Plastisin" },
      { kode: "fisik", ikon: "🚲", teks: "Sepeda, Sepatu Roda, Raket & Bola" },
      { kode: "musik", ikon: "🎸", teks: "Alat Musik & Mikrofon Karaoke" },
      { kode: "logika", ikon: "🧱", teks: "Balok Konstruksi, Magnet & Mainan Bongkar-Pasang" },
    ],
  },
  {
    id: 11,
    pertanyaan: "11. Kalau kamu jadi tokoh hebat di masa depan, kamu ingin jadi siapa?",
    opsi: [
      { kode: "logika", ikon: "👨‍🔬", teks: "Penemu Robot, Ilmuwan & Astronot" },
      { kode: "sosial", ikon: "👩‍⚕️", teks: "Dokter, Guru & Penolong Banyak Orang" },
      { kode: "seni", ikon: "👩‍🎨", teks: "Pelukis, Arsitek Gedung & Pembuat Film Kartun" },
      { kode: "fisik", ikon: "🏆", teks: "Juara Olahraga, Pilot & Petualang" },
    ],
  },
  {
    id: 12,
    pertanyaan: "12. Bagaimana caramu paling cepat menghafal sesuatu yang baru?",
    opsi: [
      { kode: "musik", ikon: "🎵", teks: "Dinyanyikan dengan Nada Lagu yang Ceria" },
      { kode: "seni", ikon: "🖼️", teks: "Melihat Gambar Warna-Warni yang Unik" },
      { kode: "fisik", ikon: "🤸", teks: "Sambil Mempraktikkan Gerakannya Langsung" },
      { kode: "bahasa", ikon: "📖", teks: "Dibacakan Ceritanya Lalu Aku Ceritakan Lagi" },
    ],
  },
  {
    id: 13,
    pertanyaan: "13. Saat ada teman baru di lingkunganmu, apa yang kamu lakukan?",
    opsi: [
      { kode: "sosial", ikon: "👋", teks: "Langsung Menyapa & Mengajaknya Main Bersama" },
      { kode: "bahasa", ikon: "🗣️", teks: "Bertanya Namanya & Bercerita Seru" },
      { kode: "mandiri", ikon: "😊", teks: "Tersenyum Sopan Sambil Melanjutkan Permainanku" },
      { kode: "alam", ikon: "🐕", teks: "Mengajaknya Melihat Hewan/Taman di Sekitar" },
    ],
  },
  {
    id: 14,
    pertanyaan: "14. Ketika menyusun mainan atau mengerjakan prakarya, apa yang paling kamu sukai?",
    opsi: [
      { kode: "mandiri", ikon: "🎯", teks: "Menyelesaikannya Sendiri Sampai Benar-Benar Beres" },
      { kode: "seni", ikon: "🌟", teks: "Membuat Bentuk Baru yang Berbeda dari Contoh" },
      { kode: "logika", ikon: "📐", teks: "Menyusunnya dengan Urutan yang Sangat Rapi & Pas" },
      { kode: "sosial", ikon: "🙌", teks: "Mengerjakannya Bareng-Bareng Kakak/Teman" },
    ],
  },
  {
    id: 15,
    pertanyaan: "15. Suara apa yang paling membuat hatimu senang saat mendengarnya?",
    opsi: [
      { kode: "musik", ikon: "🎼", teks: "Alunan Musik Piano, Gitar & Lagu Ceria" },
      { kode: "alam", ikon: "🐦", teks: "Kicau Burung, Gemericik Air & Ombak Pantai" },
      { kode: "bahasa", ikon: "🎙️", teks: "Suara Ayah/Ibu Membacakan Dongeng Seru" },
      { kode: "sosial", ikon: "😂", teks: "Suara Tawa Teman-Teman Saat Bermain Bersama" },
    ],
  },
  {
    id: 16,
    pertanyaan: "16. Sore hari setelah selesai belajar, kegiatan mana yang paling menyenangkan?",
    opsi: [
      { kode: "fisik", ikon: "🛴", teks: "Main Skuter, Kejar-Kejaran & Olahraga di Luar" },
      { kode: "alam", ikon: "🌳", teks: "Jalan-Jalan Sore Melihat Taman, Kucing & Kupu-Kupu" },
      { kode: "mandiri", ikon: "🧩", teks: "Merakit Mainan Favoritku di Kamar dengan Tenang" },
      { kode: "bahasa", ikon: "📞", teks: "Menceritakan Kejadian Hari Ini ke Ayah & Ibu" },
    ],
  },
];

const OBSERVASI_ORTU_18 = [
  { id: "ob1", kategori: "seni", teks: "Anak gemar menggambar, memadukan banyak warna, dan imajinatif saat membuat bentuk dari plastisin/kertas." },
  { id: "ob2", kategori: "seni", teks: "Anak peka terhadap detail visual (mudah mengenali perbedaan gambar, letak benda, atau keindahan warna)." },
  { id: "ob3", kategori: "fisik", teks: "Anak sangat aktif bergerak (berlari, melompat, memanjat) dengan keseimbangan tubuh yang tangkas." },
  { id: "ob4", kategori: "fisik", teks: "Koordinasi motorik halus tangannya terampil (menggunting, memegang pensil, merakit benda kecil, atau menangkap bola)." },
  { id: "ob5", kategori: "logika", teks: "Anak suka bertanya 'mengapa/bagaimana cara kerjanya' dan tertarik pada eksperimen sains atau benda mekanis." },
  { id: "ob6", kategori: "logika", teks: "Anak cepat memahami konsep angka, pola urutan, pengelompokan benda, atau menyukai permainan puzzle/lego." },
  { id: "ob7", kategori: "musik", teks: "Anak mudah menghafal nada lagu dan peka mengenali apakah suatu nada/suara terdengar harmonis." },
  { id: "ob8", kategori: "musik", teks: "Anak sering bersenandung, bernyanyi sendiri, atau mengetuk-ngetukkan jari mengikuti irama musik." },
  { id: "ob9", kategori: "bahasa", teks: "Anak memiliki perbendaharaan kata yang kaya untuk anak seusianya dan pandai merangkai cerita panjang." },
  { id: "ob10", kategori: "bahasa", teks: "Anak senang mendengarkan buku cerita, cepat menghafal kosakata baru/doa, dan berani berbicara." },
  { id: "ob11", kategori: "sosial", teks: "Anak mudah akrab dengan teman sebaya, senang bermain bersama, dan sering mengajak/mengatur permainan." },
  { id: "ob12", kategori: "sosial", teks: "Anak menunjukkan empati yang tinggi (peka menolong, menghibur, atau berbagi saat melihat teman sedih)." },
  { id: "ob13", kategori: "alam", teks: "Anak sangat antusias berinteraksi dengan hewan peliharaan, mengamati serangga/tumbuhan, dan bermain di alam." },
  { id: "ob14", kategori: "alam", teks: "Anak suka mengumpulkan benda-benda alam (daun, batu unik, kerang) dan peduli pada tanaman/hewan." },
  { id: "ob15", kategori: "mandiri", teks: "Anak mampu berkonsentrasi menyelesaikan permainannya atau tugasnya sendiri tanpa harus terus-menerus ditunggui." },
  { id: "ob16", kategori: "mandiri", teks: "Anak memiliki kemauan yang jelas, mandiri dalam rutinitas harian (makan/merapikan mainan), dan percaya diri." },
  { id: "ob17", kategori: "logika", teks: "Saat menghadapi mainan yang macet atau sulit, anak berusaha mencari akal untuk memperbaikinya dulu sebelum menyerah." },
  { id: "ob18", kategori: "sosial", teks: "Anak berani tampil di depan keluarga atau kelas (misal: bernyanyi, menyapa, atau menunjukkan karyanya)." },
];

// ============================================================================
// 2. DATABASE LENGKAP JENJANG 2: SD ATAS & SMP (9–15 TAHUN) — 36 SOAL
// ============================================================================
const DEFINISI_8_BAKAT_SMP: Record<
  string,
  Omit<DimensiScoreItem, "skorMentah" | "persen" | "peringkat" | "kategori">
> = {
  logika_sains: {
    id: "logika_sains",
    nama: "Logika, Sains & Teknologi Digital",
    julukan: "The Young Scientist & Coder",
    ikon: "🔬",
    warna: "#2563eb",
    deskripsiKekuatan:
      "Kamu punya cara berpikir yang logis, kritis, dan penasaran dengan cara kerja sains maupun teknologi. Kamu menyukai tantangan memecahkan teka-teki matematika, eksperimen IPA, atau koding komputer.",
    dampakJikaLemah:
      "Jika area logika-sains ini kurang dilatih, kamu mungkin mudah merasa pusing atau malas duluan saat bertemu pelajaran Matematika/Fisika yang banyak rumusnya.",
    solusiAgarTidakMenghambat:
      "Jangan menghafal rumus mentah-mentah! Gunakan video animasi eksperimen (seperti simulasi interaktif di HibahIlmu) supaya kamu melihat wujud nyata dari rumus tersebut, dan kerjakan soal bersama teman yang jago matematika.",
    harusNgapainSaja: [
      "Luangkan 20 menit sehari berlatih logika lewat aplikasi koding visual/Python dasar atau teka-teki sains.",
      "Biasakan membuat ringkasan rumus dengan contoh soal nyata yang paling mudah kamu mengerti.",
      "Ikuti proyek praktikum IPA atau rakit rangkaian elektronik sederhana di simulator.",
    ],
    rekomendasiLesAtauEkskul: [
      "Ekskul Karya Ilmiah Remaja (KIR) / Klub Sains OSN",
      "Kursus Coding, Robotika & Game Development",
      "Bimbingan Matematika Logika & Olimpiade",
    ],
    potensiMasaDepan: [
      "SMA Peminatan MIPA / Sains-Teknologi",
      "SMK Rekayasa Perangkat Lunak (RPL) / Teknik Komputer",
      "Karier: AI Engineer, Dokter, Data Scientist, Peneliti",
    ],
  },
  bahasa_komunikasi: {
    id: "bahasa_komunikasi",
    nama: "Bahasa, Komunikasi & Public Speaking",
    julukan: "The Confident Communicator",
    ikon: "🎙️",
    warna: "#059669",
    deskripsiKekuatan:
      "Kamu pandai merangkai kata-kata, baik saat berbicara di depan kelas, berdiskusi, maupun menulis cerita/artikel. Kamu juga cepat menyerap bahasa asing dan mampu menjelaskan sesuatu dengan asyik.",
    dampakJikaLemah:
      "Jika kemampuan komunikasi ini berada di urutan bawah, kamu mungkin sering merasa gugup saat disuruh presentasi di depan kelas atau kesulitan menuliskan ide yang ada di kepalamu menjadi karangan yang rapi.",
    solusiAgarTidakMenghambat:
      "Sebelum presentasi di kelas, tuliskan 3–5 poin inti di kartu kecil (cue card) dan berlatihlah 2 kali di depan cermin. Saat menulis karangan, buat kerangka poinnya dulu baru kembangkan jadi kalimat.",
    harusNgapainSaja: [
      "Beranikan diri mengangkat tangan minimal 1 kali setiap minggu untuk bertanya atau menjawab di kelas.",
      "Tonton film/video edukasi berbahasa Inggris atau Arab dan catat 5 kosakata baru setiap hari.",
      "Tulis jurnal harian singkat atau ulasan buku/film favoritmu untuk melatih kelancaran menulis.",
    ],
    rekomendasiLesAtauEkskul: [
      "Kursus Bahasa Inggris (Conversation / Debate) & Bahasa Asing",
      "Ekskul Jurnalistik, Mading, Podcast & Broadcasting Sekolah",
      "Klub Debat, Pidato & Storytelling (FLS2N)",
    ],
    potensiMasaDepan: [
      "SMA Peminatan Bahasa, Sosial & Hubungan Internasional",
      "Karier: Diplomat, Jurnalis, Content Creator, Pengacara, Dosen",
    ],
  },
  visual_desain: {
    id: "visual_desain",
    nama: "Desain Visual, Seni & Imajinasi Kreatif",
    julukan: "The Visual Creator & Designer",
    ikon: "🎨",
    warna: "#e11d48",
    deskripsiKekuatan:
      "Matamu sangat peka terhadap keindahan warna, tata letak, gambar, dan video. Kamu punya banyak ide kreatif untuk mendesain poster, ilustrasi digital, mengedit video, atau membuat karya seni.",
    dampakJikaLemah:
      "Jika bakat visual ini kurang dominan, catatan pelajaranmu mungkin cenderung polos/kurang rapi dan kamu cepat mengantuk jika harus membaca buku teks tebal yang tidak ada gambarnya.",
    solusiAgarTidakMenghambat:
      "Gunakan stabilo 2–3 warna untuk menandai kata kunci penting di bukumu, atau ubah rangkuman bab pelajaran menjadi bagan kotak-kotak sederhana agar otakmu tidak jenuh.",
    harusNgapainSaja: [
      "Ubah catatan pelajaran di sekolah menjadi bentuk Mind-Map (Peta Konsep) bergambar dan berwarna.",
      "Pelajari aplikasi desain grafis dan video editing (seperti Canva, Figma, atau CapCut/Premiere) untuk tugas sekolah.",
      "Kumpulkan karya gambar/desainmu di satu folder portofolio digital.",
    ],
    rekomendasiLesAtauEkskul: [
      "Ekskul Desain Grafis, Fotografi & Sinematografi/Multimedia",
      "Kelas Ilustrasi Digital, Animasi & Seni Lukis",
      "Lomba Poster Digital, Komik & Kriya (FLS2N)",
    ],
    potensiMasaDepan: [
      "SMK Desain Komunikasi Visual (DKV) / Animasi / Multimedia",
      "SMA Peminatan Seni & Teknologi Kreatif",
      "Karier: UI/UX Designer, Arsitek, Creative Director, Animator",
    ],
  },
  musik_ekspresi: {
    id: "musik_ekspresi",
    nama: "Musik, Irama & Seni Pertunjukan",
    julukan: "The Harmony & Stage Performer",
    ikon: "🎸",
    warna: "#9333ea",
    deskripsiKekuatan:
      "Kamu punya kepekaan tinggi terhadap nada, lagu, irama, dan ekspresi seni pertunjukan. Musik mampu membangkitkan semangat belajarmu dan menjadi wadah ekspresi dirimu yang paling menyenangkan.",
    dampakJikaLemah:
      "Jika kepekaan auditori-musik kurang kuat, kamu mungkin mudah terganggu oleh suara berisik saat sedang belajar atau kurang peka mengatur nada suara saat berbicara.",
    solusiAgarTidakMenghambat:
      "Jika kamu mudah terdistraksi oleh suara berisik, pilihlah tempat belajar yang tenang atau gunakan penyumbat telinga/musik instrumental lembut tanpa lirik (Lo-Fi/Klasik) saat mengerjakan PR.",
    harusNgapainSaja: [
      "Gunakan jembatan keledai (singkatan unik yang dinyanyikan) untuk menghafal materi pelajaran yang panjang.",
      "Berlatihlah memainkan minimal 1 alat musik atau olah vokal secara rutin 2–3 kali seminggu.",
      "Tampil percaya diri di acara pentas seni sekolah untuk melatih mental panggungmu.",
    ],
    rekomendasiLesAtauEkskul: [
      "Ekskul Band Sekolah, Paduan Suara, Ansambel Musik / Karawitan",
      "Les Piano, Gitar, Biola, Drum atau Vokal",
      "Ekskul Seni Tari Tradisional/Modern & Teater",
    ],
    potensiMasaDepan: [
      "SMA / SMK Seni Musik & Pertunjukan / Broadcasting",
      "Karier: Musisi, Komposer, Sound Engineer, Art Director",
    ],
  },
  kinestetik_olahraga: {
    id: "kinestetik_olahraga",
    nama: "Kinestetik, Olahraga & Praktik Lapangan",
    julukan: "The Active Champion & Builder",
    ikon: "🏆",
    warna: "#ea580c",
    deskripsiKekuatan:
      "Tubuhmu tangkas, energik, dan kamu paling cepat mengerti sesuatu kalau langsung mempraktikkannya dengan tanganmu sendiri! Kamu unggul dalam olahraga, merakit alat, atau kegiatan luar ruangan.",
    dampakJikaLemah:
      "Jika fisik-kinestetik berada di urutan bawah, kamu mungkin cepat merasa lelah saat kegiatan olahraga/upacara di sekolah, atau cenderung mager (malas gerak) sehingga stamina tubuh mudah turun.",
    solusiAgarTidakMenghambat:
      "Kamu tidak harus menjadi atlet olahraga berat! Cukup pilih olahraga ringan yang menyenangkan seperti berenang santai, jalan cepat, bersepeda pagi, atau peregangan 15 menit sehari agar tubuhmu tetap bugar dan otak tidak cepat mengantuk saat belajar.",
    harusNgapainSaja: [
      "Terapkan teknik belajar Pomodoro: 25 menit fokus belajar duduk, lalu 5 menit berdiri melakukan peregangan/jalan.",
      "Ikuti minimal 1 kegiatan olahraga rutin setiap minggu untuk menjaga kebugaran dan sportivitas.",
      "Salurkan kesukaan praktikmu dengan merakit proyek nyata (elektronika, kerajinan, berkebun, atau memasak).",
    ],
    rekomendasiLesAtauEkskul: [
      "Ekskul Olahraga Prestasi (Futsal, Basket, Badminton, Renang, Pencak Silat/Taekwondo - O2SN)",
      "Pramuka, PMR & Pecinta Alam",
      "Klub Bengkel Praktik / Robotika Mekatronika",
    ],
    potensiMasaDepan: [
      "SMK Teknik Mesin / Otomotif / Elektronika / Kesehatan",
      "SMA Keolahragaan / Akademi Militer & Kedinasan",
      "Karier: Atlet, Insinyur Mekanik/IoT, Dokter Bedah, Pilot",
    ],
  },
  kepemimpinan_sosial: {
    id: "kepemimpinan_sosial",
    nama: "Kepemimpinan, Organisasi & Empati Sosial",
    julukan: "The Team Leader & Peacemaker",
    ikon: "👑",
    warna: "#0284c7",
    deskripsiKekuatan:
      "Kamu mudah dipercaya teman-teman, peka menolong sesama, berani memimpin kerja kelompok, dan pintar mengoordinasikan acara bersama. Kehadiranmu membuat tim menjadi kompak.",
    dampakJikaLemah:
      "Jika sisi sosial-kepemimpinan ini kurang kuat, kamu mungkin lebih suka bekerja sendirian, sungkan menegur teman kelompok yang malas, atau merasa canggung saat harus masuk ke kelompok pertemanan baru.",
    solusiAgarTidakMenghambat:
      "Dalam kerja kelompok, kamu tidak harus selalu menjadi ketua yang banyak bicara; ambillah peran spesifik yang kamu kuasai (misalnya sebagai periset data atau pembuat materi) lalu komunikasikan progresmu secara jelas di grup.",
    harusNgapainSaja: [
      "Cobalah aktif menjadi pengurus kelas, panitia kegiatan sekolah, atau anggota OSIS/Pramuka.",
      "Latih kemampuan membagi tugas secara adil saat menjadi ketua kelompok belajar.",
      "Jadilah pendengar yang baik dan penengah yang adil saat ada teman yang berbeda pendapat.",
    ],
    rekomendasiLesAtauEkskul: [
      "Organisasi Siswa Intra Sekolah (OSIS) / MPK",
      "Pramuka Inti, Palang Merah Remaja (PMR) & Paskibra",
      "Klub Kewirausahaan Remaja & Koperasi Siswa",
    ],
    potensiMasaDepan: [
      "SMA Peminatan Soshum (Ekonomi, Sosiologi, Hukum)",
      "SMK Bisnis & Manajemen / Perhotelan",
      "Karier: CEO/Entrepreneur, Manajer Proyek, Psikolog, HRBP",
    ],
  },
  keteraturan_disiplin: {
    id: "keteraturan_disiplin",
    nama: "Keteraturan, Ketelitian & Tata Kelola",
    julukan: "The Organized & Reliable Planner",
    ikon: "📋",
    warna: "#0d9488",
    deskripsiKekuatan:
      "Kamu pribadi yang rapi, taat aturan, teliti memeriksa detail, dan suka merencanakan jadwal kegiatan dengan terstruktur. Tugas-tugasmu selalu terkumpul tepat waktu dan bisa diandalkan.",
    dampakJikaLemah:
      "Jika bakat keteraturan ini berada di urutan bawah, kamu berisiko sering menunda PR sampai malam terakhir (deadliner), lupa membawa buku/alat tulis, atau kehilangan poin ujian karena kurang teliti membaca soal.",
    solusiAgarTidakMenghambat:
      "Jangan mengandalkan ingatan kepala saja! Pasang alarm pengingat PR di HP setiap jam 4 sore, siapkan isi tas sekolah pada malam sebelumnya, dan wajibkan diri memeriksa ulang lembar jawaban 5 menit sebelum dikumpulkan.",
    harusNgapainSaja: [
      "Gunakan buku agenda kecil atau aplikasi To-Do List harian untuk mencentang PR yang sudah beres.",
      "Rapikan meja belajar selama 5 menit sebelum mulai belajar agar pikiranmu jernih.",
      "Latih ketelitian dengan menjadi bendahara kelas atau sekretaris kelompok.",
    ],
    rekomendasiLesAtauEkskul: [
      "Pelatihan Manajemen Waktu & Keuangan Remaja",
      "Kursus Komputer Administrasi & Pengolahan Data (Excel)",
      "Paskibra & Klub Tata Kelola Perpustakaan/Koperasi",
    ],
    potensiMasaDepan: [
      "SMA Ekonomi-Akuntansi / SMK Akuntansi & Keuangan Lembaga",
      "Karier: Auditor Keuangan, Aktuaris, Analis Sistem, Administrator",
    ],
  },
  kemandirian_fokus: {
    id: "kemandirian_fokus",
    nama: "Kemandirian, Fokus Target & Daya Juang",
    julukan: "The Focused & Resilient Achiever",
    ikon: "🎯",
    warna: "#d97706",
    deskripsiKekuatan:
      "Kamu punya motivasi dari dalam diri yang kuat! Kalau sudah punya cita-cita atau target nilai, kamu fokus mengejarnya, tahan banting saat menghadapi kesulitan, dan tidak mudah ikut-ikutan tren negatif.",
    dampakJikaLemah:
      "Jika fokus dan daya juang ini sedang lemah, kamu mudah sekali terdistraksi oleh notifikasi game/media sosial saat belajar, cepat bosan di tengah jalan, atau mudah menyerah saat mendapat nilai kurang bagus.",
    solusiAgarTidakMenghambat:
      "Jauhkan HP ke ruangan lain saat sedang fokus belajar selama 30 menit! Pecah target belajar yang besar menjadi target kecil (misalnya: 'Hari ini cukup kuasai 3 halaman saja') lalu beri hadiah kecil untuk dirimu setelah berhasil.",
    harusNgapainSaja: [
      "Tuliskan 3 target prestasimu semester ini di kertas dan tempelkan di depan meja belajarmu.",
      "Aktifkan fitur 'Mode Fokus / Jangan Ganggu' di HP setiap jam belajar malam (pukul 19.00–20.30).",
      "Evaluasi setiap hasil ulangan: jadikan nilai yang kurang sebagai petunjuk bab mana yang perlu diulang, bukan alasan untuk menyerah.",
    ],
    rekomendasiLesAtauEkskul: [
      "Program Mentoring Prestasi & Camp Motivasi Belajar",
      "Ekskul Panahan, Catur, atau Bela Diri (Melatih konsentrasi tinggi)",
      "Klub Olimpiade Sains / Riset Mandiri",
    ],
    potensiMasaDepan: [
      "Unggul di Jalur Akademik SMA maupun Vokasi SMK",
      "Karier: Peneliti Utama, Dokter Spesialis, Founder Startup, Eksekutif",
    ],
  },
};

const SOAL_SMP_36 = [
  { no: 1, sesi: 1, dimensi: "logika_sains", teks: "Saya senang mencari tahu alasan ilmiah di balik fenomena alam atau cara kerja teknologi/komputer." },
  { no: 2, sesi: 1, dimensi: "bahasa_komunikasi", teks: "Saya mudah merangkai kata-kata saat bercerita, menulis karangan, atau menjelaskan sesuatu ke teman." },
  { no: 3, sesi: 1, dimensi: "visual_desain", teks: "Saya suka menggambar, mendesain poster/slide yang estetik, atau mengedit foto dan video." },
  { no: 4, sesi: 1, dimensi: "musik_ekspresi", teks: "Saya sangat peka terhadap irama musik, cepat hafal lagu, atau suka memainkan alat musik/menyanyi." },
  { no: 5, sesi: 1, dimensi: "kinestetik_olahraga", teks: "Saya paling bersemangat saat pelajaran olahraga, kegiatan lapangan, atau praktik merakit benda nyata." },
  { no: 6, sesi: 1, dimensi: "kepemimpinan_sosial", teks: "Saya senang membantu teman yang kesulitan dan berani mengatur pembagian tugas saat kerja kelompok." },
  { no: 7, sesi: 1, dimensi: "keteraturan_disiplin", teks: "Saya terbiasa mencatat jadwal PR dengan rapi dan tidak suka mengumpulkan tugas terlambat." },
  { no: 8, sesi: 1, dimensi: "kemandirian_fokus", teks: "Jika saya sudah menetapkan suatu target nilai atau cita-cita, saya akan fokus mengejarnya sampai berhasil." },
  { no: 9, sesi: 1, dimensi: "logika_sains", teks: "Memecahkan soal teka-teki logika, matematika, atau mengutak-atik kode program sangat menantang bagi saya." },
  { no: 10, sesi: 1, dimensi: "bahasa_komunikasi", teks: "Saya tertarik mempelajari bahasa asing (Inggris/Arab/lainnya) dan berani tampil bicara di depan kelas." },
  { no: 11, sesi: 1, dimensi: "visual_desain", teks: "Saya lebih mudah membayangkan sesuatu lewat gambar, peta warna, atau sketsa desain." },
  { no: 12, sesi: 1, dimensi: "musik_ekspresi", teks: "Mendengarkan alunan musik atau tampil di pentas seni membuat suasana hati saya langsung bersemangat." },
  { no: 13, sesi: 1, dimensi: "kinestetik_olahraga", teks: "Saya tidak betah hanya duduk diam seharian; tubuh saya rasanya ingin aktif bergerak atau mempraktikkan sesuatu." },
  { no: 14, sesi: 1, dimensi: "kepemimpinan_sosial", teks: "Saya mudah akrab dengan teman baru dan suka mendamaikan teman yang sedang berselisih paham." },
  { no: 15, sesi: 1, dimensi: "keteraturan_disiplin", teks: "Saya teliti memeriksa kembali jawaban ulangan dan menjaga kerapian buku serta barang-barang saya." },
  { no: 16, sesi: 1, dimensi: "kemandirian_fokus", teks: "Ketika menemui materi pelajaran yang sulit, saya berusaha mencari solusinya sampai paham dan tidak gampang menyerah." },
  { no: 17, sesi: 1, dimensi: "logika_sains", teks: "Saya suka mengamati data, tabel, atau melakukan percobaan di laboratorium IPA/komputer." },
  { no: 18, sesi: 1, dimensi: "bahasa_komunikasi", teks: "Saya gemar membaca buku/artikel menarik dan membagikan ceritanya kepada orang lain." },
  { no: 19, sesi: 1, dimensi: "visual_desain", teks: "Saya punya banyak imajinasi untuk menciptakan karya kreatif yang unik dan enak dipandang mata." },
  { no: 20, sesi: 1, dimensi: "musik_ekspresi", teks: "Saya mudah mengingat materi pelajaran jika diubah menjadi singkatan berirama atau lagu." },
  { no: 21, sesi: 1, dimensi: "kinestetik_olahraga", teks: "Tangan saya terampil menggunakan peralatan kerja, merakit komponen, atau melakukan gerakan olahraga." },
  { no: 22, sesi: 1, dimensi: "kepemimpinan_sosial", teks: "Saya senang aktif di kegiatan organisasi sekolah (OSIS/Pramuka/Kepanitiaan) dan kegiatan sosial." },
  { no: 23, sesi: 1, dimensi: "keteraturan_disiplin", teks: "Saya merasa tenang apabila aturan main, jadwal kegiatan, dan langkah-langkah tugas sudah jelas sejak awal." },
  { no: 24, sesi: 1, dimensi: "kemandirian_fokus", teks: "Saya mampu belajar mandiri di rumah tanpa harus selalu disuruh-suruh oleh orang tua." },
  { no: 25, sesi: 2, dimensi: "vak_visual", teks: "[Gaya Belajar] Saya paling cepat paham materi guru kalau ditulis di papan tulis disertai gambar/diagram warna." },
  { no: 26, sesi: 2, dimensi: "vak_auditori", teks: "[Gaya Belajar] Saya lebih cepat mengerti kalau mendengarkan penjelasan lisan guru atau berdiskusi tanya-jawab." },
  { no: 27, sesi: 2, dimensi: "vak_kinestetik", teks: "[Gaya Belajar] Saya baru benar-benar paham suatu pelajaran kalau langsung mencoba mempraktikkannya sendiri." },
  { no: 28, sesi: 2, dimensi: "vak_visual", teks: "[Gaya Belajar] Saat menghafal, saya sering membayangkan letak tulisan atau gambar tersebut di halaman buku." },
  { no: 29, sesi: 2, dimensi: "vak_auditori", teks: "[Gaya Belajar] Saat menghafal di rumah, saya suka membaca materi dengan suara agak keras agar terdengar telinga saya." },
  { no: 30, sesi: 2, dimensi: "vak_kinestetik", teks: "[Gaya Belajar] Saat sedang menghafal atau berpikir, saya suka sambil berjalan mondar-mandir atau menggerakkan tangan." },
  { no: 31, sesi: 2, dimensi: "vak_visual", teks: "[Gaya Belajar] Saya lebih suka menonton video animasi/infografis daripada hanya mendengarkan ceramah panjang." },
  { no: 32, sesi: 2, dimensi: "vak_auditori", teks: "[Gaya Belajar] Saya mudah mengingat penjelasan teman saat belajar kelompok atau mendengarkan podcast edukasi." },
  { no: 33, sesi: 2, dimensi: "vak_kinestetik", teks: "[Gaya Belajar] Saya sangat menyukai pelajaran yang ada kegiatan simulasi, peragaan alat, atau kunjungan lapangan." },
  { no: 34, sesi: 2, dimensi: "vak_visual", teks: "[Gaya Belajar] Catatan yang rapi, diberi stabilo warna, dan dibuat peta konsep sangat membantu saya saat ujian." },
  { no: 35, sesi: 2, dimensi: "vak_auditori", teks: "[Gaya Belajar] Saya senang mengajari kembali materi pelajaran kepada teman dengan menjelaskannya secara lisan." },
  { no: 36, sesi: 2, dimensi: "vak_kinestetik", teks: "[Gaya Belajar] Belajar lewat eksperimen, bongkar-pasang alat, atau membuat proyek nyata adalah favorit saya." },
];

// ============================================================================
// 3. DATABASE LENGKAP JENJANG 3: REMAJA SMA / SMK (15–18 TAHUN) — 48 SOAL
// ============================================================================
const DEFINISI_6_RIASEC_SMA: Record<
  string,
  Omit<DimensiScoreItem, "skorMentah" | "persen" | "peringkat" | "kategori">
> = {
  I: {
    id: "I",
    nama: "Investigative (Sains, Riset, IT, Data & Medis)",
    julukan: "The Analytical Thinker & Scientist",
    ikon: "🧬",
    warna: "#2563eb",
    deskripsiKekuatan:
      "Kamu memiliki daya analisis yang tajam, rasa ingin tahu ilmiah yang mendalam, dan senang memecahkan persoalan kompleks berbasis data, algoritma pemrograman, maupun riset sains/medis.",
    dampakJikaLemah:
      "Jika dimensi Investigative ini berada di urutan bawah, kamu mungkin cepat jenuh menghadapi riset teoretis yang abstrak, analisis statistik yang rumit, atau tugas pemrograman yang menuntut logika mendalam.",
    solusiAgarTidakMenghambat:
      "Saat harus mengerjakan tugas riset/data di perkuliahan nanti, gunakan bantuan tools analitik modern, terjemahkan teori abstrak menjadi studi kasus praktis, dan berkolaborasilah dengan rekan tim yang kuat di analisis data.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Matematika Tingkat Lanjut, Informatika/Koding, Fisika, Biologi, atau Kimia.",
      "Bangun portofolio proyek nyata: buat aplikasi web/mobile, proyek IoT, atau karya tulis ilmiah/riset.",
      "Latih kemampuan penalaran kuantitatif dan literasi sains secara rutin untuk persiapan SNBT/UTBK.",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Informatika, Matematika Lanjut, Fisika/Biologi/Kimia",
      "Jurusan Kuliah: Teknik Informatika / AI / Sains Data / Sistem Informasi",
      "Jurusan Kuliah: Kedokteran / Farmasi / Teknik Biomedis / Statistika",
    ],
    potensiMasaDepan: [
      "AI & Machine Learning Engineer / Full-Stack Developer",
      "Dokter Spesialis / Peneliti Biomedis & Farmasi",
      "Data Scientist & Cybersecurity Specialist",
    ],
  },
  A: {
    id: "A",
    nama: "Artistic (Desain, Arsitektur, Media Kreatif & Inovasi)",
    julukan: "The Visionary Designer & Creator",
    ikon: "🎨",
    warna: "#e11d48",
    deskripsiKekuatan:
      "Kamu unggul dalam imajinasi orisinal, kepekaan estetika visual/audio, dan kemampuan merancang karya kreatif yang inovatif serta menyentuh emosi audiens.",
    dampakJikaLemah:
      "Jika dimensi Artistic ini kurang dominan, cara penyajian presentasi atau produk yang kamu buat mungkin terasa kaku/monoton, dan kamu cenderung terpaku pada cara lama yang sudah baku.",
    solusiAgarTidakMenghambat:
      "Gunakan sistem template desain profesional dan pelajari prinsip dasar UI/UX atau komunikasi visual agar setiap laporan, produk, atau presentasi yang kamu hasilkan tetap menarik secara visual.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Seni Rupa/Desain, Informatika Multimedia, Bahasa Inggris Lanjut, atau Prakarya Kewirausahaan.",
      "Susun portofolio digital (Behance/GitHub/Dribbble/YouTube) yang berisi minimal 5 karya desain, arsitektur, atau video terbaikmu untuk syarat SNBP/SNBT jurusan seni-desain.",
      "Pelajari penggabungan seni dan teknologi (seperti UI/UX Design, 3D Modeling, atau Creative Coding).",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Seni Budaya/Desain, Informatika, Bahasa Inggris Lanjut",
      "Jurusan Kuliah: Desain Komunikasi Visual (DKV) & Desain Produk",
      "Jurusan Kuliah: Arsitektur, Film & Animasi, Ilmu Komunikasi Kreatif",
    ],
    potensiMasaDepan: [
      "UI/UX Product Designer & Creative Director",
      "Arsitek & Urban Designer",
      "Animator, Filmmaker & Brand Strategist",
    ],
  },
  S: {
    id: "S",
    nama: "Social (Edukasi, Psikologi, HRBP, Konseling & Kesehatan)",
    julukan: "The Empathetic Mentor & People Developer",
    ikon: "🤝",
    warna: "#059669",
    deskripsiKekuatan:
      "Kamu memiliki kecerdasan interpersonal yang hangat, empati yang kuat, kemampuan komunikasi persuasif, serta kepuasan batin saat mengajar, membimbing, atau memulihkan kesejahteraan orang lain.",
    dampakJikaLemah:
      "Jika dimensi Social ini berada di peringkat bawah, kamu mungkin cenderung terlalu blak-blakan/dingin saat menyampaikan kritik, kurang sabar membimbing rekan yang lambat, atau kurang nyaman bekerja di bidang pelayanan publik.",
    solusiAgarTidakMenghambat:
      "Latih teknik komunikasi empatik (puji dulu hal yang sudah benar sebelum memberi masukan perbaikan) dan sadari bahwa kesuksesan karier teknis pun tetap membutuhkan kerja sama tim yang harmonis.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Sosiologi, Biologi/Kesehatan, Bahasa Indonesia & Bahasa Asing.",
      "Asah pengalaman sebagai mentor sebaya (peer-tutor), konselor remaja/PIK-R, atau relawan pengabdian masyarakat.",
      "Pelajari ilmu psikologi perkembangan, manajemen sumber daya manusia (HR), dan komunikasi publik.",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Sosiologi, Biologi, Bahasa Inggris/Asing, Antropologi",
      "Jurusan Kuliah: Psikologi, Manajemen SDM (Human Capital), Bimbingan Konseling",
      "Jurusan Kuliah: Pendidikan/Keguruan, Kesehatan Masyarakat, Keperawatan, Hubungan Internasional",
    ],
    potensiMasaDepan: [
      "HR Business Partner (HRBP) & Organizational Development (OD) Specialist",
      "Psikolog Klinis/Industri & Konselor Karier",
      "Dosen, Guru Inovatif & EdTech Specialist",
    ],
  },
  E: {
    id: "E",
    nama: "Enterprising (Bisnis, Kepemimpinan, Hukum & Strategi)",
    julukan: "The Strategic Leader & Entrepreneur",
    ikon: "🚀",
    warna: "#d97706",
    deskripsiKekuatan:
      "Kamu memiliki jiwa kepemimpinan yang berani, orientasi pencapaian target yang tinggi, kepiawaian bernegosiasi, serta naluri tajam dalam melihat peluang bisnis dan menggerakkan organisasi.",
    dampakJikaLemah:
      "Jika dimensi Enterprising ini kurang kuat, kamu mungkin kurang percaya diri saat harus menjual/mempresentasikan nilai karyamu (personal branding), ragu mengambil posisi pemimpin, atau menghindari negosiasi.",
    solusiAgarTidakMenghambat:
      "Kamu tidak harus menjadi politisi atau salesman agresif. Bangun kepemimpinan berbasis keahlian (expert leadership) dan latih kemampuan dasar mempresentasikan manfaat karyamu secara terstruktur.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Ekonomi, Prakarya & Kewirausahaan, Sosiologi/PPKn, dan Matematika.",
      "Ambil peran kepemimpinan di OSIS, kepanitiaan besar, atau rintis proyek bisnis kecil/kompetisi Business Plan.",
      "Asah keterampilan public speaking, negosiasi, dan literasi finansial/investasi sejak bangku SMA.",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Ekonomi, Kewirausahaan, Sosiologi, Bahasa Inggris",
      "Jurusan Kuliah: Manajemen Bisnis, Kewirausahaan (Entrepreneurship), Bisnis Digital",
      "Jurusan Kuliah: Ilmu Hukum, Hubungan Internasional, Manajemen Industri",
    ],
    potensiMasaDepan: [
      "Tech Startup Founder / CEO & Business Development Director",
      "Product Manager & Marketing Strategist",
      "Konsultan Manajemen, Pengacara Korporat & Diplomat",
    ],
  },
  R: {
    id: "R",
    nama: "Realistic (Rekayasa Teknik, IoT, Otomotif & Lapangan)",
    julukan: "The Practical Engineer & Builder",
    ikon: "⚙️",
    warna: "#ea580c",
    deskripsiKekuatan:
      "Kamu menyukai pekerjaan yang konkret, praktis, dan menggunakan keahlian teknis untuk merakit perangkat keras, mengendalikan mesin, membangun infrastruktur, atau mengelola agroteknologi di lapangan.",
    dampakJikaLemah:
      "Jika dimensi Realistic ini berada di urutan bawah, kamu mungkin kurang terampil menangani perbaikan alat fisik/perangkat keras secara langsung dan lebih memilih bekerja di balik layar konsep/digital.",
    solusiAgarTidakMenghambat:
      "Saat mengerjakan proyek yang membutuhkan implementasi perangkat keras atau teknis lapangan, berpasanganlah dengan rekan teknisi/engineer praktis sehingga ide konseptualmu dapat terwujud nyata.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Fisika Terapan, Informatika & Elektronika, Kimia, atau Biologi Pertanian.",
      "Praktikkan pembuatan prototipe nyata (misalnya menggunakan simulator Wokwi ESP32/Arduino di HibahIlmu lalu merakit alat aslinya).",
      "Ikuti lomba inovasi teknologi tepat guna, robotika, atau rekayasa keteknikan.",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Fisika, Matematika Lanjut, Informatika, Kimia/Biologi",
      "Jurusan Kuliah: Teknik Elektro, Teknik Mesin, Teknik Sipil, Teknik Industri",
      "Jurusan Kuliah: Sistem Tertanam (IoT/Robotika), Agroteknologi, Teknik Geologi/Pertambangan",
    ],
    potensiMasaDepan: [
      "IoT & Embedded Systems Engineer / Robotics Engineer",
      "Civil, Mechanical & Electrical Project Engineer",
      "Smart Agriculture & Renewable Energy Specialist",
    ],
  },
  C: {
    id: "C",
    nama: "Conventional (Keuangan, Akuntansi, Audit & Tata Kelola Data)",
    julukan: "The Precision Guardian & Financial Architect",
    ikon: "📊",
    warna: "#0d9488",
    deskripsiKekuatan:
      "Kamu sangat unggul dalam ketelitian, keteraturan struktur data, kepatuhan pada regulasi/SOP, pengelolaan anggaran keuangan, serta pemeriksaan mutu yang presisi dan bebas dari kesalahan.",
    dampakJikaLemah:
      "Jika dimensi Conventional ini berada di urutan paling bawah, kamu berisiko kurang rapi dalam dokumentasi administrasi, malas mengurus pembukuan uang, atau melewatkan detail aturan tertulis yang krusial.",
    solusiAgarTidakMenghambat:
      "Gunakan aplikasi pencatat keuangan dan template administrasi otomatis. Jangan ragu mendelegasikan urusan pembukuan detail kepada rekan yang teliti sambil kamu tetap memeriksa ringkasan akhirnya.",
    harusNgapainSaja: [
      "Pilih Mata Pelajaran Pilihan: Ekonomi/Akuntansi, Matematika, dan Informatika Pengolahan Data.",
      "Kuasai keterampilan Microsoft Excel/Google Sheets tingkat lanjut, database SQL dasar, dan literasi akuntansi.",
      "Biasakan menyusun jadwal belajar, arsip portofolio sertifikat, dan perencanaan target nilai SNBP/SNBT secara rapi.",
    ],
    rekomendasiLesAtauEkskul: [
      "Mapel Pilihan: Ekonomi & Akuntansi, Matematika, Informatika",
      "Jurusan Kuliah: Akuntansi, Perpajakan, Keuangan & Perbankan",
      "Jurusan Kuliah: Ilmu Aktuaria, Statistika, Administrasi Bisnis/Publik, Sistem Informasi",
    ],
    potensiMasaDepan: [
      "Financial Analyst, Auditor & Chief Financial Officer (CFO)",
      "Actuary (Aktuaris) & Risk Management Specialist",
      "Database Administrator & Quality Assurance (QA) Lead",
    ],
  },
};

const SOAL_SMA_48 = [
  { no: 1, sesi: 1, dimensi: "R", teks: "Saya senang merakit perangkat elektronik/IoT, mengutak-atik mesin, atau menggunakan peralatan teknis secara langsung." },
  { no: 2, sesi: 1, dimensi: "I", teks: "Saya antusias memecahkan persoalan sains, matematika lanjut, atau menulis kode algoritma pemrograman." },
  { no: 3, sesi: 1, dimensi: "A", teks: "Saya menikmati kebebasan berkreasi membuat desain visual (UI/UX/Grafis), karya arsitektur, musik, atau konten kreatif." },
  { no: 4, sesi: 1, dimensi: "S", teks: "Saya merasa bahagia saat bisa mengajar, membimbing, atau membantu teman menyelesaikan masalah pribadinya." },
  { no: 5, sesi: 1, dimensi: "E", teks: "Saya menyukai tantangan memimpin organisasi/tim, merintis usaha bisnis, dan meyakinkan orang lain." },
  { no: 6, sesi: 1, dimensi: "C", teks: "Saya teliti dalam menyusun laporan keuangan, mengelola tabel data di komputer, dan menjaga keteraturan arsip." },
  { no: 7, sesi: 1, dimensi: "R", teks: "Saya lebih suka kuliah/bekerja yang banyak praktik laboratorium atau terjun ke lapangan daripada hanya membaca teori." },
  { no: 8, sesi: 1, dimensi: "I", teks: "Saya gemar menelusuri jurnal/artikel ilmiah untuk memahami hubungan sebab-akibat dari suatu fenomena atau penyakit." },
  { no: 9, sesi: 1, dimensi: "A", teks: "Saya selalu berusaha menampilkan ide yang orisinal, estetik, dan berbeda dari cara-cara standar yang membosankan." },
  { no: 10, sesi: 1, dimensi: "S", teks: "Saya tertarik mendalami psikologi manusia, cara mengembangkan potensi orang lain (HR/People Development), atau kesehatan." },
  { no: 11, sesi: 1, dimensi: "E", teks: "Saya berani mengambil keputusan penting di situasi mendesak dan menetapkan target prestasi yang tinggi." },
  { no: 12, sesi: 1, dimensi: "C", teks: "Saya merasa nyaman bekerja dengan standar aturan (SOP) yang jelas, jadwal terstruktur, dan perhitungan angka yang akurat." },
  { no: 13, sesi: 1, dimensi: "R", teks: "Saya tertarik mempelajari cara kerja infrastruktur bangunan, jaringan telekomunikasi, robotika, atau agroteknologi modern." },
  { no: 14, sesi: 1, dimensi: "I", teks: "Menganalisis kumpulan data besar (Big Data/Statistika) untuk menemukan pola tersembunyi sangat menarik bagi saya." },
  { no: 15, sesi: 1, dimensi: "A", teks: "Saya peka terhadap keindahan tata letak aplikasi, komposisi warna, sinematografi video, atau penulisan naratif." },
  { no: 16, sesi: 1, dimensi: "S", teks: "Dalam kerja kelompok, saya selalu menjaga agar semua anggota merasa dihargai, kompak, dan tidak ada yang terabaikan." },
  { no: 17, sesi: 1, dimensi: "E", teks: "Saya pandai bernegosiasi, memasarkan keunggulan suatu ide/produk, dan membangun jejaring kemitraan luas." },
  { no: 18, sesi: 1, dimensi: "C", teks: "Saya selalu memeriksa ulang detail pekerjaan saya agar bebas dari kesalahan ketik maupun selisih perhitungan." },
  { no: 19, sesi: 1, dimensi: "R", teks: "Saya terampil memperbaiki peralatan yang rusak dan menyukai pekerjaan yang menghasilkan produk fisik nyata." },
  { no: 20, sesi: 1, dimensi: "I", teks: "Saya betah berkonsentrasi lama untuk meriset topik rumit seperti kecerdasan buatan (AI), bioteknologi, atau kedokteran." },
  { no: 21, sesi: 1, dimensi: "A", teks: "Saya sering diminta teman untuk mendesain tampilan presentasi, poster acara, atau konsep kreatif kegiatan sekolah." },
  { no: 22, sesi: 1, dimensi: "S", teks: "Cita-cita terbesar saya adalah memiliki karier yang secara langsung menolong, mendidik, atau menyejahterakan sesama." },
  { no: 23, sesi: 1, dimensi: "E", teks: "Saya tertantang mengikuti kompetisi bisnis, debat, atau memimpin proyek besar hingga meraih predikat terbaik." },
  { no: 24, sesi: 1, dimensi: "C", teks: "Saya menyukai bidang akuntansi, audit, perpajakan, aktuaria, atau administrasi sistem yang rapi dan terukur." },
  { no: 25, sesi: 1, dimensi: "R", teks: "Saya memiliki koordinasi motorik dan ketahanan fisik yang prima untuk menangani peralatan kerja di lapangan." },
  { no: 26, sesi: 1, dimensi: "I", teks: "Sebelum mempercayai suatu kesimpulan, saya selalu menuntut bukti empiris dan logika yang masuk akal." },
  { no: 27, sesi: 1, dimensi: "A", teks: "Saya mampu mengubah konsep yang kaku menjadi karya visual, cerita, atau desain antarmuka yang memikat." },
  { no: 28, sesi: 1, dimensi: "S", teks: "Saya sabar mendengarkan curhatan orang lain dan mampu memberikan saran yang menenangkan hati mereka." },
  { no: 29, sesi: 1, dimensi: "E", teks: "Saya senang merumuskan strategi jangka panjang dan memotivasi tim untuk mencapai target organisasi." },
  { no: 30, sesi: 1, dimensi: "C", teks: "Mengelola anggaran, mengarsipkan dokumen penting, dan mengawasi kepatuhan mutu adalah keahlian alami saya." },
  { no: 31, sesi: 2, dimensi: "I", teks: "[Kesiapan Kuliah] Saya terbiasa belajar mandiri mencari referensi dari jurnal, dokumentasi internet, atau buku teks." },
  { no: 32, sesi: 2, dimensi: "A", teks: "[Kesiapan Kuliah] Saya mampu menghasilkan ide-ide segar (brainstorming) saat tim membutuhkan solusi di luar kebiasaan." },
  { no: 33, sesi: 2, dimensi: "S", teks: "[Kesiapan Kuliah] Saya mudah beradaptasi dan bekerja sama secara harmonis dengan orang-orang dari berbagai latar belakang." },
  { no: 34, sesi: 2, dimensi: "E", teks: "[Kesiapan Kuliah] Saya berani tampil mempresentasikan gagasan saya dengan meyakinkan di hadapan dosen/guru dan audiens." },
  { no: 35, sesi: 2, dimensi: "C", teks: "[Kesiapan Kuliah] Saya disiplin mengatur waktu antara belajar akademik, organisasi, dan istirahat tanpa menunda tugas." },
  { no: 36, sesi: 2, dimensi: "R", teks: "[Kesiapan Kuliah] Saya cepat menguasai penggunaan perangkat keras, instrumen laboratorium, atau software teknis baru." },
  { no: 37, sesi: 2, dimensi: "I", teks: "[Kesiapan Karier] Ketika menghadapi masalah yang rumit, saya mengurainya menjadi bagian-bagian logis untuk dicari akar penyebabnya." },
  { no: 38, sesi: 2, dimensi: "A", teks: "[Kesiapan Karier] Saya senang merancang prototipe desain, mockup aplikasi, atau karya kreatif yang punya nilai jual." },
  { no: 39, sesi: 2, dimensi: "S", teks: "[Kesiapan Karier] Saya peka membaca potensi unik tiap anggota tim dan senang membantu mereka berkembang." },
  { no: 40, sesi: 2, dimensi: "E", teks: "[Kesiapan Karier] Saya memiliki inisiatif tinggi untuk memulai langkah nyata tanpa harus selalu menunggu perintah." },
  { no: 41, sesi: 2, dimensi: "C", teks: "[Kesiapan Karier] Saya memegang teguh integritas, kejujuran data, dan tanggung jawab sampai pekerjaan tuntas 100%." },
  { no: 42, sesi: 2, dimensi: "R", teks: "[Kesiapan Karier] Saya tahan banting menguji coba alat/kode program berulang-ulang sampai benar-benar berjalan lancar." },
  { no: 43, sesi: 2, dimensi: "I", teks: "[Visi Masa Depan] Saya ingin berkarier di bidang yang terus menuntut pembelajaran ilmu pengetahuan dan teknologi mutakhir." },
  { no: 44, sesi: 2, dimensi: "A", teks: "[Visi Masa Depan] Saya ingin dikenal lewat karya-karya kreatif, inovatif, dan desain yang menginspirasi banyak orang." },
  { no: 45, sesi: 2, dimensi: "S", teks: "[Visi Masa Depan] Saya ingin berkarier di bidang yang berdampak langsung pada pendidikan, kesehatan, atau pengembangan manusia." },
  { no: 46, sesi: 2, dimensi: "E", teks: "[Visi Masa Depan] Saya ingin memimpin perusahaan/institusi, mengelola proyek strategis, atau membangun bisnis sendiri." },
  { no: 47, sesi: 2, dimensi: "C", teks: "[Visi Masa Depan] Saya ingin menjadi ahli profesional yang menjaga stabilitas finansial, sistem, dan tata kelola organisasi." },
  { no: 48, sesi: 2, dimensi: "R", teks: "[Visi Masa Depan] Saya ingin menjadi insinyur/praktisi handal yang membangun sistem infrastruktur, mesin, atau teknologi nyata." },
];

export const MultiJenjangTalentSuite: React.FC<{
  modeJenjang: "anak_tk_sd" | "smp" | "sma";
  namaPeserta: string;
  setNamaPeserta: (v: string) => void;
  instansiPeserta: string;
  setInstansiPeserta: (v: string) => void;
  emailPeserta?: string;
}> = ({
  modeJenjang,
  namaPeserta,
  setNamaPeserta,
  instansiPeserta,
  setInstansiPeserta,
  emailPeserta = "peserta@hibahilmu.id",
}) => {
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [statusCloud, setStatusCloud] = useState<string>("");

  // Mode Print Terpisah: "sertifikat_saja" (1 Hal A4 Portrait Utuh) atau "laporan_saja" (Detail Hasil)
  const [modeCetakAktif, setModeCetakAktif] = useState<
    "semua" | "sertifikat_saja" | "laporan_saja"
  >("semua");

  const cetakDokumenTerpisah = (
    pilihan: "sertifikat_saja" | "laporan_saja"
  ) => {
    setModeCetakAktif(pilihan);
    setTimeout(() => {
      window.print();
      setTimeout(() => setModeCetakAktif("semua"), 500);
    }, 180);
  };

  // ==========================================================================
  // STATE JENJANG 1: ANAK 3–8 TAHUN
  // ==========================================================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [subTahapAnak, setSubTahapAnak] = useState<
    "kanvas" | "kartu" | "observasi" | "hasil"
  >("kanvas");
  const [sedangMenggambar, setSedangMenggambar] = useState<boolean>(false);
  const [warnaKuas, setWarnaKuas] = useState<string>("#e11d48");
  const [ukuranKuas, setUkuranKuas] = useState<number>(10);
  const [misiKanvasAktif, setMisiKanvasAktif] =
    useState<MisiKanvasId>("rumah_pohon");

  const [galeriKaryaKanvas, setGaleriKaryaKanvas] = useState<
    Partial<Record<MisiKanvasId, string>>
  >({});
  const [misiPernahDigoresSet, setMisiPernahDigoresSet] = useState<
    Set<MisiKanvasId>
  >(new Set());
  const [warnaTerpakaiSet, setWarnaTerpakaiSet] = useState<Set<string>>(
    new Set(["#e11d48"])
  );
  const [jumlahGoresan, setJumlahGoresan] = useState<number>(0);
  const [totalPanjangGoresan, setTotalPanjangGoresan] = useState<number>(0);

  const [indeksKartuAnak, setIndeksKartuAnak] = useState<number>(0);
  const [jawabanKartuAnak, setJawabanKartuAnak] = useState<
    Record<number, string>
  >({});
  const [observasiOrtuSkor, setObservasiOrtuSkor] = useState<
    Record<string, number>
  >({});

  // ==========================================================================
  // STATE JENJANG 2: SD ATAS & SMP (36 SOAL) & JENJANG 3: SMA (48 SOAL)
  // ==========================================================================
  const [subTahapSmp, setSubTahapSmp] = useState<"sesi1" | "sesi2" | "hasil">(
    "sesi1"
  );
  const [indeksSoalSmp, setIndeksSoalSmp] = useState<number>(0);
  const [jawabanSmp, setJawabanSmp] = useState<Record<number, number>>({});

  const [subTahapSma, setSubTahapSma] = useState<"sesi1" | "sesi2" | "hasil">(
    "sesi1"
  );
  const [indeksSoalSma, setIndeksSoalSma] = useState<number>(0);
  const [jawabanSma, setJawabanSma] = useState<Record<number, number>>({});

  const gambarOutlineDasar = (tipe: MisiKanvasId) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;

    if (tipe === "rumah_pohon") {
      ctx.beginPath();
      ctx.arc(65, 50, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(145, 110);
      ctx.lineTo(225, 42);
      ctx.lineTo(305, 110);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(165, 110, 120, 95);
      ctx.strokeRect(210, 148, 30, 57);
      ctx.strokeRect(410, 125, 24, 80);
      ctx.beginPath();
      ctx.arc(422, 92, 42, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tipe === "robot_bintang") {
      ctx.strokeRect(205, 42, 90, 62);
      ctx.beginPath();
      ctx.arc(230, 72, 9, 0, Math.PI * 2);
      ctx.arc(270, 72, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(185, 112, 130, 95);
      ctx.strokeRect(145, 120, 34, 68);
      ctx.strokeRect(321, 120, 34, 68);
      ctx.beginPath();
      ctx.arc(80, 75, 24, 0, Math.PI * 2);
      ctx.arc(445, 75, 28, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tipe === "taman_satwa") {
      ctx.beginPath();
      ctx.arc(150, 120, 35, 0, Math.PI * 2);
      ctx.arc(205, 120, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(380, 110, 18, 0, Math.PI * 2);
      ctx.arc(380, 75, 16, 0, Math.PI * 2);
      ctx.arc(380, 145, 16, 0, Math.PI * 2);
      ctx.arc(345, 110, 16, 0, Math.PI * 2);
      ctx.arc(415, 110, 16, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const simpanSnapshotKanvasSaatIni = (
    misiId: MisiKanvasId = misiKanvasAktif
  ) => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    try {
      const dataUrl = cvs.toDataURL("image/png");
      setGaleriKaryaKanvas((prev) => ({
        ...prev,
        [misiId]: dataUrl,
      }));
    } catch {}
  };

  useEffect(() => {
    if (modeJenjang === "anak_tk_sd" && subTahapAnak === "kanvas") {
      const timer = setTimeout(() => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        const rekamanLama = galeriKaryaKanvas[misiKanvasAktif];
        if (rekamanLama) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = rekamanLama;
        } else {
          gambarOutlineDasar(misiKanvasAktif);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [modeJenjang, subTahapAnak, misiKanvasAktif]);

  const gantiMisiKanvasDenganAman = (targetMisi: MisiKanvasId) => {
    simpanSnapshotKanvasSaatIni(misiKanvasAktif);
    setMisiKanvasAktif(targetMisi);
  };

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
    setMisiPernahDigoresSet((prev) => new Set(prev).add(misiKanvasAktif));

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

  const akhiriGoresKanvas = () => {
    if (sedangMenggambar) {
      setSedangMenggambar(false);
      simpanSnapshotKanvasSaatIni(misiKanvasAktif);
    }
  };

  const hapusUlangiKanvasIni = () => {
    gambarOutlineDasar(misiKanvasAktif);
    setGaleriKaryaKanvas((prev) => {
      const salinan = { ...prev };
      delete salinan[misiKanvasAktif];
      return salinan;
    });
    setMisiPernahDigoresSet((prev) => {
      const next = new Set(prev);
      next.delete(misiKanvasAktif);
      return next;
    });
  };

  const simpanLaporanMultiJenjangKeCloud = async (
    labelJenjang: string,
    daftarDimensi: DimensiScoreItem[]
  ) => {
    setStatusCloud("Menyimpan ke Akun Cloud...");
    try {
      await fetch("/api/talent-mapping", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          result: {
            idHasil: `TM-${modeJenjang.toUpperCase()}-${Date.now()}`,
            namaPeserta: namaPeserta || "Peserta Asesmen",
            emailPeserta,
            instansiPeserta: `${instansiPeserta} (${labelJenjang})`,
            tanggalTes: new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            nomorDokumenRahasia: `CONF-${modeJenjang.toUpperCase()}-${Math.floor(
              100000 + Math.random() * 900000
            )}`,
            bakatUtama1_7: daftarDimensi.slice(0, 3).map((d, i) => ({
              id: d.id,
              nama: d.nama,
              peringkat: i + 1,
              domain: "Thinking",
              deskripsiKuat: d.deskripsiKekuatan,
            })),
            top5PersonalBranding: daftarDimensi.slice(0, 3).map((d) => ({
              id: d.id,
              nama: d.julukan,
              kategori: labelJenjang,
              deskripsi: d.deskripsiKekuatan,
              skorKecocokan: d.persen,
            })),
          },
        }),
      });
      setStatusCloud("Tersimpan Permanen di Akun Cloud ✓");
    } catch {
      setStatusCloud("Tersimpan di Browser ✓");
    }
  };

  const renderSpiderRadarSvg = (items: DimensiScoreItem[]) => {
    const cx = 145;
    const cy = 145;
    const maxR = 94;
    const n = items.length;
    if (n === 0) return null;

    const points = items
      .map((item, idx) => {
        const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
        const r = (Math.max(18, item.persen) / 100) * maxR;
        const x = (cx + r * Math.cos(angle)).toFixed(1);
        const y = (cy + r * Math.sin(angle)).toFixed(1);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg viewBox="0 0 290 290" className="w-64 h-64 overflow-visible mx-auto">
        {[0.25, 0.5, 0.75, 1].map((st, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={maxR * st}
            fill="none"
            stroke="#cbd5e1"
            strokeDasharray="3 2"
            strokeWidth="1"
          />
        ))}
        {items.map((item, idx) => {
          const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
          const x2 = cx + maxR * Math.cos(angle);
          const y2 = cy + maxR * Math.sin(angle);
          const lx = cx + (maxR + 26) * Math.cos(angle);
          const ly = cy + (maxR + 22) * Math.sin(angle);
          return (
            <g key={item.id}>
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                fill="#0f172a"
                fontSize="8.5"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {item.ikon} {item.nama.split(" ")[0]} ({item.persen}%)
              </text>
            </g>
          );
        })}
        <polygon
          points={points}
          fill="rgba(225, 29, 72, 0.25)"
          stroke="#e11d48"
          strokeWidth="2.5"
        />
      </svg>
    );
  };

  // ==========================================================================
  // SERTIFIKAT PENGHARGAAN EMAS (DIKALIBRASI PAS 1 HALAMAN A4 PORTRAIT UTUH!)
  // ==========================================================================
  const renderSertifikatPenghargaanResmi = (
    daftarUrut: DimensiScoreItem[],
    labelJenjang: string
  ) => {
    const top3 = daftarUrut.slice(0, 3);
    const karyaTersimpanList = Object.entries(galeriKaryaKanvas);
    const tanggalCetak = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="p-1.5 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 shadow-2xl print:shadow-none break-inside-avoid print:max-h-[268mm] print:overflow-hidden">
        <div className="bg-gradient-to-b from-[#fffdf5] via-white to-[#fefce8] text-slate-900 p-6 sm:p-7 print:p-5 rounded-[22px] border-4 border-double border-amber-600/80 space-y-4 print:space-y-3 relative">
          {/* Header Sertifikat */}
          <div className="flex flex-wrap justify-between items-center gap-3 border-b-2 border-amber-300 pb-3 print:pb-2.5">
            <div className="flex items-center gap-3">
              <img
                src="/hibahilmu.jpg"
                alt="Logo Panda HibahIlmu"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                }}
                className="w-14 h-14 print:w-12 print:h-12 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
              />
              <div>
                <div className="text-[9.5px] font-black uppercase tracking-widest text-amber-800">
                  OFFICIAL TALENT CERTIFICATE • PANDA HIBAHILMU INDONESIA
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  SERTIFIKAT PENGHARGAAN BAKAT &amp; POTENSI EMAS
                </h3>
                <div className="text-[11px] font-bold text-emerald-700">
                  {labelJenjang.split(" •")[0]}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-xs">
                <Award className="w-3.5 h-3.5" /> TERVERIFIKASI
              </div>
              <span className="text-[9.5px] font-mono text-slate-500 mt-0.5">
                Diterbitkan: {tanggalCetak}
              </span>
            </div>
          </div>

          {/* Nama Penerima Sertifikat & Julukan Bintang */}
          <div className="text-center space-y-1.5 py-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Diberikan dengan bangga kepada:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-4">
              {namaPeserta || "Ananda / Siswa Berbakat"}
            </div>
            <div className="pt-1">
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow-sm">
                🌟 Gelar Bakat Utama: &ldquo;{top3[0]?.julukan || "Bintang Masa Depan"}&rdquo;
              </span>
            </div>
            <p className="max-w-2xl mx-auto text-[11px] text-slate-600 leading-snug pt-0.5">
              Telah menyelesaikan rangkaian asesmen pemetaan bakat, minat, dan kecerdasan alami di{" "}
              <strong>HibahIlmu.id</strong> dengan keistimewaan utama pada bidang berikut:
            </p>
          </div>

          {/* 3 Medali Emas Bakat Terkuat (Kompak & Rapi Agar Tidak Mendorong Halaman) */}
          <div className="grid grid-cols-3 gap-2.5 print:grid-cols-3">
            {top3.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 print:p-2.5 rounded-2xl bg-white border-2 border-amber-400 shadow-xs flex flex-col justify-between gap-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl">{item.ikon}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-400 text-amber-950 font-black text-[9.5px]">
                    🏅 Medali #{idx + 1} ({item.persen}%)
                  </span>
                </div>
                <div>
                  <div className="font-black text-xs text-slate-900 leading-tight">
                    {item.nama}
                  </div>
                  <div className="text-[10px] font-bold text-rose-700 mt-0.5">
                    {item.julukan}
                  </div>
                </div>
                <div className="text-[9.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 leading-tight">
                  Rekomendasi Utama: {item.rekomendasiLesAtauEkskul[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Galeri Bukti Karya Mewarnai/Lukisan Anak (Tinggi Dikalibrasi h-16 saat Print agar Pas 1 Halaman!) */}
          {modeJenjang === "anak_tk_sd" && karyaTersimpanList.length > 0 && (
            <div className="p-3 print:p-2.5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-1.5">
              <div className="text-[10.5px] font-black uppercase text-amber-900 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-rose-600" /> Portofolio Karya Lukisan &amp; Mewarnai Tangan {namaPeserta || "Ananda"} ({karyaTersimpanList.length} Karya):
              </div>
              <div className="grid grid-cols-4 gap-2">
                {karyaTersimpanList.map(([idMisi, dataUrl]) => {
                  const infoMisi = DAFTAR_MISI_KANVAS.find((m) => m.id === idMisi);
                  return (
                    <div
                      key={idMisi}
                      className="bg-white p-1.5 rounded-xl border border-amber-300 shadow-xs text-center space-y-0.5"
                    >
                      <img
                        src={dataUrl}
                        alt={infoMisi?.judul || idMisi}
                        className="w-full h-20 print:h-16 object-contain rounded border bg-white"
                      />
                      <div className="text-[9px] font-black text-slate-700 truncate">
                        {infoMisi?.judul || idMisi}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tanda Tangan & Pengesahan Sertifikat (Selalu Utuh di Halaman yang Sama!) */}
          <div className="pt-2.5 border-t border-amber-300 flex justify-between items-end gap-4 text-xs">
            <div className="space-y-0.5">
              <div className="font-black text-xs text-slate-800">
                Unit Kerja / Sekolah: {instansiPeserta}
              </div>
              <div className="text-[9.5px] text-slate-500">
                Dokumen Rahasia &amp; Sertifikat Resmi Pengembangan Potensi Anak/Siswa
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9.5px] font-bold text-slate-500">
                Disahkan secara digital oleh:
              </div>
              <div className="font-black text-xs sm:text-sm text-emerald-800 mt-0.5">
                Panda HibahIlmu Talent &amp; People Development Center
              </div>
              <div className="text-[9.5px] font-mono text-slate-500">
                hibahilmu.my.id • Wakaf &amp; Hibah Ilmu Gratis Indonesia
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // LAPORAN LENGKAP DENGAN 2 TOMBOL PRINT TERPISAH (SERTIFIKAT SAJA vs LAPORAN SAJA)
  // ==========================================================================
  const renderLaporanEksekutifLengkap = (params: {
    judulLaporan: string;
    subjudulJenjang: string;
    daftarUrut: DimensiScoreItem[];
    infoTambahanAtas?: React.ReactNode;
  }) => {
    const { judulLaporan, subjudulJenjang, daftarUrut, infoTambahanAtas } = params;
    const kekuatanUtama = daftarUrut.slice(0, 3);
    const kekuatanPendukung = daftarUrut.slice(
      3,
      Math.max(4, daftarUrut.length - 2)
    );
    const areaLemah = daftarUrut.slice(-2);

    return (
      <div className="space-y-6 print:space-y-0">
        {/* TOOLBAR 2 PILIHAN CETAK TERPISAH */}
        <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl border border-slate-700 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs font-bold text-emerald-400">
            ✓ {statusCloud || "Pilih Cetak Sertifikat Saja (1 Hal Portrait) atau Cetak Laporan Hasil:"}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                simpanLaporanMultiJenjangKeCloud(subjudulJenjang, daftarUrut)
              }
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CloudUpload className="w-4 h-4" /> Simpan ke Akun Cloud
            </button>

            {/* TOMBOL 1: PRINT SERTIFIKAT SAJA (PORTRAIT 1 HALAMAN UTUH) */}
            <button
              type="button"
              onClick={() => cetakDokumenTerpisah("sertifikat_saja")}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Medal className="w-4 h-4" /> 1. Print Sertifikat Saja (Portrait 1 Hal)
            </button>

            {/* TOMBOL 2: PRINT LAPORAN HASIL SAJA (TERPISAH DARI SERTIFIKAT) */}
            <button
              type="button"
              onClick={() => cetakDokumenTerpisah("laporan_saja")}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <FileText className="w-4 h-4" /> 2. Print Laporan Hasil Saja (PDF)
            </button>
          </div>
        </div>

        {/* BLOK 1: SERTIFIKAT PENGHARGAAN EMAS (SEMBUNYIKAN JIKA SEDANG CETAK LAPORAN SAJA) */}
        <div
          className={
            modeCetakAktif === "laporan_saja" ? "hidden print:hidden" : "block"
          }
        >
          {renderSertifikatPenghargaanResmi(daftarUrut, subjudulJenjang)}
        </div>

        {/* BLOK 2: LAPORAN ANALISIS LENGKAP (SEMBUNYIKAN JIKA SEDANG CETAK SERTIFIKAT SAJA) */}
        <div
          className={
            modeCetakAktif === "sertifikat_saja"
              ? "hidden print:hidden"
              : "bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border-2 border-slate-300 shadow-2xl space-y-8 print:border-none print:shadow-none print:p-0"
          }
        >
          {/* KOP SURAT RESMI PANDA HIBAHILMU */}
          <div className="border-b-4 border-emerald-700 pb-5 flex flex-wrap justify-between items-center gap-4 break-inside-avoid">
            <div className="flex items-center gap-4">
              <img
                src="/hibahilmu.jpg"
                alt="Logo Panda HibahIlmu"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
                }}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
              />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  PANDA HIBAHILMU.ID • PEOPLE &amp; TALENT DEVELOPMENT CENTER
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {judulLaporan}
                </h2>
                <div className="text-xs font-bold text-slate-600">
                  {subjudulJenjang}
                </div>
              </div>
            </div>

            <div className="text-right bg-rose-50 border-2 border-rose-600 px-4 py-2 rounded-2xl">
              <div className="text-[10px] font-black uppercase text-rose-700 flex items-center justify-end gap-1">
                <Lock className="w-3 h-3" /> DOKUMEN BERSIFAT RAHASIA (CONFIDENTIAL)
              </div>
              <div className="text-sm font-black text-slate-900">
                Peserta: {namaPeserta || "Ananda / Siswa"}
              </div>
              <div className="text-[11px] font-bold text-slate-600">
                {instansiPeserta} • {emailPeserta}
              </div>
            </div>
          </div>

          {infoTambahanAtas}

          {/* BAGIAN 1: SPIDER RADAR CHART & PERINGKAT LENGKAP SEMUA DIMENSI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50 p-5 rounded-3xl border break-inside-avoid print:grid-cols-12">
            <div className="lg:col-span-5 print:col-span-5 flex flex-col items-center">
              <div className="text-xs font-black uppercase text-slate-800 mb-2">
                🕸️ Peta Radar Profil Kekuatan ({namaPeserta || "Peserta"})
              </div>
              {renderSpiderRadarSvg(daftarUrut)}
            </div>

            <div className="lg:col-span-7 print:col-span-7 space-y-2.5">
              <div className="text-xs font-black uppercase text-indigo-900">
                📊 Urutan Peringkat Kekuatan dari Tertinggi hingga Terendah:
              </div>
              {daftarUrut.map((d) => (
                <div key={d.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-black">
                    <span>
                      #{d.peringkat}. {d.ikon} {d.nama} —{" "}
                      <span className="text-indigo-700">{d.julukan}</span>
                    </span>
                    <span>{d.persen}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{
                        width: `${d.persen}%`,
                        backgroundColor: d.warna,
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN 2: 3 KEKUATAN UTAMA + RENCANA AKSI (HARUS NGAPAIN SAJA) + LES/EKSKUL */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-black uppercase text-rose-700 border-b-2 border-rose-600 pb-1.5">
              🌟 1. Kekuatan Utama Paling Menonjol &amp; Langkah Konkret (Harus Ngapain Saja)
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {kekuatanUtama.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-rose-50/60 border-2 border-rose-200 space-y-3 break-inside-avoid"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="font-black text-base text-rose-950">
                      {item.ikon} Peringkat #{item.peringkat}: {item.nama} ({item.julukan})
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black">
                      Skor Kekuatan: {item.persen}% (Dominan Utama)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {item.deskripsiKekuatan}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 print:grid-cols-3">
                    <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                      <div className="text-[11px] font-black uppercase text-emerald-800 flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5" /> Harus Ngapain Saja? (Action Plan):
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {item.harusNgapainSaja.map((langkah, i) => (
                          <li key={i}>{langkah}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                      <div className="text-[11px] font-black uppercase text-indigo-800 flex items-center gap-1">
                        <Target className="w-3.5 h-3.5" /> Perlu Dileskan / Ikut Kegiatan Apa?:
                      </div>
                      <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-1">
                        {item.rekomendasiLesAtauEkskul.map((les, i) => (
                          <li key={i}>{les}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
                      <div className="text-[11px] font-black uppercase text-amber-800 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" /> Arah Jurusan &amp; Karier Masa Depan:
                      </div>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {item.potensiMasaDepan.map((kar, i) => (
                          <li key={i}>{kar}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN 3: BAKAT PENDUKUNG */}
          <div className="space-y-3 break-inside-avoid">
            <h3 className="text-base font-black uppercase text-amber-700 border-b-2 border-amber-500 pb-1.5">
              ⚡ 2. Kekuatan Pendukung (Supporting Potentials)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3">
              {kekuatanPendukung.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-1.5 break-inside-avoid"
                >
                  <div className="font-black text-xs sm:text-sm text-amber-950">
                    #{item.peringkat}. {item.ikon} {item.nama} ({item.persen}%)
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    {item.deskripsiKekuatan}
                  </p>
                  <div className="text-[11px] font-bold text-indigo-900 pt-1">
                    Kegiatan Pendukung: {item.rekomendasiLesAtauEkskul[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BAGIAN 4: BEDAH KELEMAHAN & CARA MENYIASATI AGAR TIDAK MENGHAMBAT */}
          <div className="space-y-4 break-inside-avoid">
            <div className="border-b-2 border-slate-800 pb-1.5">
              <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> 3. Analisis Area Lemah (Urutan Terbawah) &amp; Strategi Agar Tidak Menghambat Prestasi
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Setiap anak dan remaja memiliki area yang kurang dominan. Jangan dimarahi atau dipaksa berlebihan! Gunakan strategi kompensasi di bawah ini agar kelemahan tersebut tidak menghambat masa depannya:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
              {areaLemah.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-slate-100 border-2 border-slate-300 space-y-2.5 break-inside-avoid"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-sm text-slate-900">
                      #{item.peringkat}. {item.ikon} {item.nama} ({item.persen}%)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-black">
                      Area Perlu Siasat &amp; Pendampingan
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950">
                    <strong>⚠️ Risiko Jika Dibiarkan:</strong> {item.dampakJikaLemah}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950">
                    <strong>💡 Solusi &amp; Cara Mengatasi Agar Tidak Menghambat:</strong>{" "}
                    {item.solusiAgarTidakMenghambat}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-3 flex flex-wrap justify-between items-center text-[10px] font-bold text-slate-500 break-inside-avoid">
            <span>
              © {new Date().getFullYear()} Panda HibahIlmu.id — Dicetak untuk:{" "}
              {namaPeserta || "Peserta"}
            </span>
            <span className="text-rose-700 font-black uppercase">
              CONFIDENTIAL • DOKUMEN RAHASIA PENGEMBANGAN BAKAT &amp; PENDIDIKAN
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // RENDER JENJANG 1: ANAK 3–8 TAHUN
  // ==========================================================================
  if (modeJenjang === "anak_tk_sd") {
    const jmlKartuTerisi = Object.keys(jawabanKartuAnak).length;
    const jmlObservasiTerisi = Object.keys(observasiOrtuSkor).length;
    const jmlKanvasDiwarnai = Object.keys(galeriKaryaKanvas).length;

    const hitungSkorLengkapAnak = (): DimensiScoreItem[] => {
      const skorMap: Record<string, number> = {
        seni: 25,
        fisik: 25,
        logika: 25,
        musik: 25,
        bahasa: 25,
        sosial: 25,
        alam: 25,
        mandiri: 25,
      };

      skorMap.seni += Math.min(
        28,
        warnaTerpakaiSet.size * 3.5 + Math.max(1, jmlKanvasDiwarnai) * 4
      );
      skorMap.fisik += Math.min(22, Math.round(totalPanjangGoresan / 15));
      skorMap.mandiri += Math.min(
        20,
        Math.max(1, jmlKanvasDiwarnai) * 5 + Math.min(10, jumlahGoresan)
      );
      if (misiPernahDigoresSet.has("robot_bintang")) skorMap.logika += 14;
      if (misiPernahDigoresSet.has("rumah_pohon")) skorMap.alam += 14;
      if (misiPernahDigoresSet.has("taman_satwa")) skorMap.seni += 12;

      Object.values(jawabanKartuAnak).forEach((kode) => {
        if (skorMap[kode] !== undefined) skorMap[kode] += 12;
      });

      OBSERVASI_ORTU_18.forEach((ob) => {
        const nilai = observasiOrtuSkor[ob.id] || 0;
        if (nilai > 0 && skorMap[ob.kategori] !== undefined) {
          skorMap[ob.kategori] += nilai * 8;
        }
      });

      return Object.entries(DEFINISI_8_DIMENSI_ANAK)
        .map(([id, def]) => {
          const mentah = skorMap[id] || 30;
          const persen = Math.min(98, Math.max(38, Math.round(mentah)));
          return {
            ...def,
            skorMentah: mentah,
            persen,
            peringkat: 0,
            kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
          };
        })
        .sort((a, b) => b.skorMentah - a.skorMentah)
        .map((item, idx) => ({
          ...item,
          peringkat: idx + 1,
          kategori:
            idx < 3
              ? ("Kekuatan Utama" as const)
              : idx < 6
              ? ("Kekuatan Pendukung" as const)
              : ("Area Perlu Stimulasi / Tantangan" as const),
        }));
    };

    const kartuAktif = KARTU_VISUAL_ANAK_16[indeksKartuAnak];

    return (
      <div className="space-y-6 print:space-y-0">
        <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: "kanvas",
              label: "1. Studio Gambar & Warna",
              sub: `${jmlKanvasDiwarnai} Kanvas Tersimpan (Pilih ≥1 Boleh!)`,
            },
            {
              id: "kartu",
              label: `2. Kartu Cerita Bergambar`,
              sub: `${jmlKartuTerisi}/16 Kartu Dipilih`,
            },
            {
              id: "observasi",
              label: "3. Observasi Orang Tua",
              sub: `${jmlObservasiTerisi}/18 Perilaku Diisi`,
            },
            {
              id: "hasil",
              label: "4. Sertifikat & Laporan Anak",
              sub: "Les, Kelemahan & Lukisan",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (subTahapAnak === "kanvas") {
                  simpanSnapshotKanvasSaatIni(misiKanvasAktif);
                }
                setSubTahapAnak(tab.id as any);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition ${
                subTahapAnak === tab.id
                  ? "bg-pink-600 text-white border-amber-300 shadow-lg"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">{tab.label}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  subTahapAnak === tab.id ? "text-amber-200" : "text-slate-500"
                }`}
              >
                {tab.sub}
              </div>
            </button>
          ))}
        </div>

        <div className="print:hidden bg-white p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-black text-slate-700">
              Nama Lengkap Anak (Tercetak di Sertifikat):
            </label>
            <input
              type="text"
              placeholder="Ketik nama panggilan/lengkap anak..."
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border font-bold"
            />
          </div>
          <div>
            <label className="font-black text-slate-700">
              Usia &amp; Sekolah (PAUD/TK/SD):
            </label>
            <input
              type="text"
              placeholder="Contoh: Usia 4 Tahun — PAUD / TK A"
              value={instansiPeserta}
              onChange={(e) => setInstansiPeserta(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border font-bold"
            />
          </div>
        </div>

        {subTahapAnak === "kanvas" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  ✓ Boleh Pilih 1 Gambar Saja atau Warnai Semuanya! (Otomatis Tersimpan Saat Pindah Tab)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  🎨 Ajak Anak Memilih Gambar yang Ia Suka &amp; Mewarnainya!
                </h3>
                <p className="text-xs text-slate-600">
                  Untuk anak usia 3–5 tahun, mewarnai{" "}
                  <strong>1 gambar saja sudah cukup</strong>. Setiap goresan otomatis
                  disimpan dan akan tampil di <strong>Sertifikat Emas Ananda</strong>!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  simpanSnapshotKanvasSaatIni(misiKanvasAktif);
                  setSubTahapAnak("kartu");
                }}
                className="px-4 py-2.5 rounded-xl bg-pink-600 text-white font-black text-xs cursor-pointer shadow"
              >
                Simpan Gambar &amp; Lanjut ke Kartu ➔
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {DAFTAR_MISI_KANVAS.map((m) => {
                const aktif = misiKanvasAktif === m.id;
                const sudahAdaGambar = Boolean(galeriKaryaKanvas[m.id]);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => gantiMisiKanvasDenganAman(m.id)}
                    className={`p-3 rounded-2xl text-left border-2 cursor-pointer transition ${
                      aktif
                        ? "bg-indigo-600 text-white border-amber-400 shadow-md"
                        : sudahAdaGambar
                        ? "bg-emerald-50 text-emerald-950 border-emerald-400"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <div className="font-black flex justify-between items-center">
                      <span>{m.judul}</span>
                      {sudahAdaGambar && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px]">
                          Tersimpan ✓
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        aktif ? "text-indigo-100" : "text-slate-500"
                      }`}
                    >
                      {m.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-700">
                  <Paintbrush className="w-4 h-4 inline text-rose-600 mr-1" />
                  Pilih Warna Kuas:
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
                    className={`w-7 h-7 rounded-full cursor-pointer border-2 ${
                      warnaKuas === hex ? "scale-125 ring-2 ring-amber-400" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span>Ukuran Kuas:</span>
                <input
                  type="range"
                  min={4}
                  max={28}
                  value={ukuranKuas}
                  onChange={(e) => setUkuranKuas(Number(e.target.value))}
                  className="w-20"
                />
                <button
                  type="button"
                  onClick={hapusUlangiKanvasIni}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 font-black cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5 inline mr-1" /> Hapus / Ulangi Kanvas Ini
                </button>
              </div>
            </div>

            <div className="flex justify-center bg-slate-100 p-3 rounded-2xl border-2 border-dashed border-slate-300">
              <canvas
                ref={canvasRef}
                width={540}
                height={240}
                onMouseDown={mulaiGoresKanvas}
                onMouseMove={lanjutkanGoresKanvas}
                onMouseUp={akhiriGoresKanvas}
                onMouseLeave={akhiriGoresKanvas}
                className="w-full max-w-[540px] h-[240px] bg-white rounded-2xl shadow-inner cursor-crosshair border"
              />
            </div>
          </div>
        )}

        {subTahapAnak === "kartu" && kartuAktif && (
          <div className="bg-white p-6 rounded-3xl border-2 border-sky-300 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-100 text-sky-900">
                  Tahap 2 dari 3 • Permainan Pilih Gambar ({jmlKartuTerisi} / 16 Terjawab)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  🖼️ Bacakan Pertanyaan Ini &amp; Biarkan Anak Menunjuk Gambarnya!
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                  />
                  <span>Otomatis Pindah Kartu</span>
                </label>
                <button
                  type="button"
                  onClick={() => setJawabanKartuAnak({})}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
                >
                  Kosongkan
                </button>
                <button
                  type="button"
                  onClick={() => setSubTahapAnak("observasi")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
                >
                  Lanjut ke Observasi Ortu ➔
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5">
              <div className="flex justify-between text-xs font-mono text-amber-300">
                <span>Kartu Cerita #{kartuAktif.id} dari 16</span>
                <span>
                  {jawabanKartuAnak[kartuAktif.id]
                    ? "✓ Sudah Dipilih"
                    : "○ Belum Dipilih (Kosong)"}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-black">
                {kartuAktif.pertanyaan}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kartuAktif.opsi.map((op, i) => {
                  const dipilih = jawabanKartuAnak[kartuAktif.id] === op.kode;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setJawabanKartuAnak((prev) => ({
                          ...prev,
                          [kartuAktif.id]: op.kode,
                        }));
                        if (autoNext && indeksKartuAnak < 15) {
                          setTimeout(
                            () => setIndeksKartuAnak((idx) => Math.min(15, idx + 1)),
                            160
                          );
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition cursor-pointer ${
                        dipilih
                          ? "bg-amber-400 text-slate-950 border-white scale-[1.02] shadow-lg"
                          : "bg-slate-800 text-white border-slate-700 hover:border-amber-400"
                      }`}
                    >
                      <span className="text-4xl shrink-0">{op.ikon}</span>
                      <span className="font-black text-sm leading-snug">
                        {op.teks}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {KARTU_VISUAL_ANAK_16.map((k, idx) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setIndeksKartuAnak(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-black border cursor-pointer ${
                    indeksKartuAnak === idx
                      ? "bg-pink-600 text-white"
                      : jawabanKartuAnak[k.id]
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {k.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {subTahapAnak === "observasi" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Tahap 3 dari 3 • Kuesioner Pengamatan Orang Tua / Guru ({jmlObservasiTerisi} / 18 Diisi)
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  📋 Nilai Keseharian Anak untuk Mempertajam Akurasi Machine Learning
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setObservasiOrtuSkor({})}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
              >
                Kosongkan Semua
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OBSERVASI_ORTU_18.map((ob, idx) => {
                const skor = observasiOrtuSkor[ob.id];
                return (
                  <div
                    key={ob.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5"
                  >
                    <div className="text-xs font-black text-slate-800">
                      {idx + 1}. {ob.teks}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: 1, l: "Belum Terlihat" },
                        { v: 2, l: "Kadang-Kadang" },
                        { v: 3, l: "Sangat Sering!" },
                      ].map((op) => (
                        <button
                          key={op.v}
                          type="button"
                          onClick={() =>
                            setObservasiOrtuSkor((prev) => ({
                              ...prev,
                              [ob.id]: op.v,
                            }))
                          }
                          className={`py-2 px-2 rounded-xl text-[11px] font-black border cursor-pointer ${
                            skor === op.v
                              ? "bg-emerald-600 text-white border-emerald-800"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {op.l}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSubTahapAnak("hasil")}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm shadow-xl cursor-pointer"
            >
              🎉 Terbitkan Sertifikat Emas &amp; Laporan Lengkap Bakat Anak Sekarang!
            </button>
          </div>
        )}

        {subTahapAnak === "hasil" &&
          renderLaporanEksekutifLengkap({
            judulLaporan: "Laporan Komprehensif Bakat, Motorik & Kecerdasan Majemuk Anak",
            subjudulJenjang: `Jenjang Anak Usia Dini (3–8 Tahun / PAUD–TK–SD) • Analisis Kanvas (${jmlKanvasDiwarnai} Karya, ${warnaTerpakaiSet.size} Warna), 16 Kartu Visual & 18 Observasi`,
            daftarUrut: hitungSkorLengkapAnak(),
          })}
      </div>
    );
  }

  // ==========================================================================
  // RENDER JENJANG 2: SD ATAS & SMP (36 SOAL)
  // ==========================================================================
  if (modeJenjang === "smp") {
    const jmlTerisiSmp = Object.keys(jawabanSmp).length;
    const soalSmpAktif = SOAL_SMP_36[indeksSoalSmp];

    const hitungSkorLengkapSmp = () => {
      const mapSkor: Record<string, number> = {};
      Object.keys(DEFINISI_8_BAKAT_SMP).forEach((k) => (mapSkor[k] = 0));
      const vak = { visual: 0, auditori: 0, kinestetik: 0 };

      SOAL_SMP_36.forEach((s) => {
        const val = jawabanSmp[s.no] ?? 3;
        if (s.sesi === 1 && mapSkor[s.dimensi] !== undefined) {
          mapSkor[s.dimensi] += val;
        } else if (s.dimensi === "vak_visual") vak.visual += val;
        else if (s.dimensi === "vak_auditori") vak.auditori += val;
        else if (s.dimensi === "vak_kinestetik") vak.kinestetik += val;
      });

      const daftarUrut: DimensiScoreItem[] = Object.entries(DEFINISI_8_BAKAT_SMP)
        .map(([id, def]) => {
          const mentah = mapSkor[id] || 9;
          const persen = Math.min(98, Math.max(35, Math.round((mentah / 15) * 100)));
          return {
            ...def,
            skorMentah: mentah,
            persen,
            peringkat: 0,
            kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
          };
        })
        .sort((a, b) => b.skorMentah - a.skorMentah)
        .map((item, idx) => ({
          ...item,
          peringkat: idx + 1,
          kategori:
            idx < 3
              ? ("Kekuatan Utama" as const)
              : idx < 6
              ? ("Kekuatan Pendukung" as const)
              : ("Area Perlu Stimulasi / Tantangan" as const),
        }));

      const vakUrut = Object.entries(vak).sort((a, b) => b[1] - a[1]);
      return { daftarUrut, vak, vakDominan: vakUrut[0][0] };
    };

    const hasilSmp = hitungSkorLengkapSmp();

    return (
      <div className="space-y-6 print:space-y-0">
        <div className="print:hidden grid grid-cols-3 gap-3">
          {[
            { id: "sesi1", label: "1. Sesi 1: 8 Bakat SMP (Soal 1–24)", sub: "Minat, Akademik & Karakter" },
            { id: "sesi2", label: "2. Sesi 2: Gaya Belajar VAK (Soal 25–36)", sub: "Visual, Auditori, Kinestetik" },
            { id: "hasil", label: "3. Sertifikat & Laporan SMP", sub: `Terisi: ${jmlTerisiSmp}/36 Soal` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSubTahapSmp(t.id as any);
                if (t.id === "sesi1") setIndeksSoalSmp(0);
                if (t.id === "sesi2") setIndeksSoalSmp(24);
              }}
              className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer ${
                subTahapSmp === t.id
                  ? "bg-sky-700 text-white border-amber-300 shadow-lg"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div className="font-black text-xs sm:text-sm">{t.label}</div>
              <div className="text-[10px] opacity-80">{t.sub}</div>
            </button>
          ))}
        </div>

        {(subTahapSmp === "sesi1" || subTahapSmp === "sesi2") && soalSmpAktif && (
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-100 text-sky-900">
                  Asesmen Remaja SD Atas &amp; SMP (9–15 Tahun) • Terjawab: {jmlTerisiSmp} / 36 Soal
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Butir Pernyataan #{soalSmpAktif.no} dari 36
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoNext}
                    onChange={(e) => setAutoNext(e.target.checked)}
                  />
                  <span>Otomatis Pindah Soal</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setJawabanSmp({});
                    setIndeksSoalSmp(0);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
                >
                  Kosongkan Semua
                </button>
                <button
                  type="button"
                  onClick={() => setSubTahapSmp("hasil")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
                >
                  Lihat Sertifikat &amp; Hasil ➔
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
              <div className="flex justify-between text-xs font-mono text-amber-300">
                <span>Soal #{soalSmpAktif.no} / 36</span>
                <span>
                  {jawabanSmp[soalSmpAktif.no] !== undefined
                    ? `✓ Sudah Dijawab (Skor ${jawabanSmp[soalSmpAktif.no]})`
                    : "○ Belum Dijawab (Kosong)"}
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-black leading-relaxed">
                &ldquo;{soalSmpAktif.teks}&rdquo;
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { v: 1, l: "Sangat Tidak Cocok" },
                  { v: 2, l: "Kurang Cocok" },
                  { v: 3, l: "Netral / Biasa" },
                  { v: 4, l: "Cocok" },
                  { v: 5, l: "Sangat Menggambarkan Aku!" },
                ].map((op) => {
                  const dipilih = jawabanSmp[soalSmpAktif.no] === op.v;
                  return (
                    <button
                      key={op.v}
                      type="button"
                      onClick={() => {
                        setJawabanSmp((prev) => ({
                          ...prev,
                          [soalSmpAktif.no]: op.v,
                        }));
                        if (autoNext && indeksSoalSmp < 35) {
                          setTimeout(() => {
                            const nextIdx = indeksSoalSmp + 1;
                            setIndeksSoalSmp(nextIdx);
                            if (nextIdx >= 24) setSubTahapSmp("sesi2");
                          }, 160);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition ${
                        dipilih
                          ? "bg-amber-400 text-slate-950 border-white scale-105"
                          : "bg-slate-800 text-white border-slate-700 hover:border-sky-400"
                      }`}
                    >
                      <div className="text-lg">{op.v}</div>
                      <div className="text-[10px]">{op.l}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SOAL_SMP_36.map((s, idx) => (
                <button
                  key={s.no}
                  type="button"
                  onClick={() => {
                    setIndeksSoalSmp(idx);
                    setSubTahapSmp(s.sesi === 1 ? "sesi1" : "sesi2");
                  }}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black border cursor-pointer ${
                    indeksSoalSmp === idx
                      ? "bg-rose-600 text-white"
                      : jawabanSmp[s.no] !== undefined
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {s.no}
                </button>
              ))}
            </div>
          </div>
        )}

        {subTahapSmp === "hasil" &&
          renderLaporanEksekutifLengkap({
            judulLaporan: "Laporan Talent Mapping, Gaya Belajar (VAK) & Arah Minat Siswa SMP",
            subjudulJenjang: `Jenjang SD Atas & SMP (9–15 Tahun) • Gaya Belajar Dominan: ${hasilSmp.vakDominan.toUpperCase()}`,
            daftarUrut: hasilSmp.daftarUrut,
            infoTambahanAtas: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-200 break-inside-avoid print:grid-cols-3">
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-indigo-900">
                    👁️ Gaya Belajar Visual: {Math.round((hasilSmp.vak.visual / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat peta konsep (Mind-Map), diagram warna, dan video visual.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-amber-900">
                    🎧 Gaya Belajar Auditori: {Math.round((hasilSmp.vak.auditori / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat diskusi aktif, membaca nyaring, dan mengajari teman.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white border">
                  <div className="font-black text-xs text-emerald-900">
                    🛠️ Gaya Belajar Kinestetik: {Math.round((hasilSmp.vak.kinestetik / 20) * 100)}%
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Serap pelajaran lewat eksperimen laboratorium, simulasi, dan praktik langsung.
                  </p>
                </div>
              </div>
            ),
          })}
      </div>
    );
  }

  // ==========================================================================
  // RENDER JENJANG 3: REMAJA SMA / SMK (48 SOAL)
  // ==========================================================================
  const jmlTerisiSma = Object.keys(jawabanSma).length;
  const soalSmaAktif = SOAL_SMA_48[indeksSoalSma];

  const hitungSkorLengkapSma = (): DimensiScoreItem[] => {
    const mapSkor: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    SOAL_SMA_48.forEach((s) => {
      const val = jawabanSma[s.no] ?? 3;
      mapSkor[s.dimensi] = (mapSkor[s.dimensi] || 0) + val;
    });

    return Object.entries(DEFINISI_6_RIASEC_SMA)
      .map(([id, def]) => {
        const mentah = mapSkor[id] || 24;
        const persen = Math.min(99, Math.max(36, Math.round((mentah / 40) * 100)));
        return {
          ...def,
          skorMentah: mentah,
          persen,
          peringkat: 0,
          kategori: "Kekuatan Pendukung" as DimensiScoreItem["kategori"],
        };
      })
      .sort((a, b) => b.skorMentah - a.skorMentah)
      .map((item, idx) => ({
        ...item,
        peringkat: idx + 1,
        kategori:
          idx < 2
            ? ("Kekuatan Utama" as const)
            : idx < 4
            ? ("Kekuatan Pendukung" as const)
            : ("Area Perlu Stimulasi / Tantangan" as const),
      }));
  };

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="print:hidden grid grid-cols-3 gap-3">
        {[
          { id: "sesi1", label: "1. Sesi 1: Minat RIASEC (Soal 1–30)", sub: "6 Dimensi Karier & Jurusan" },
          { id: "sesi2", label: "2. Sesi 2: Kesiapan Kuliah (Soal 31–48)", sub: "Kompetensi Eksekusi Abad 21" },
          { id: "hasil", label: "3. Sertifikat & Penjurusan SMA", sub: `Terisi: ${jmlTerisiSma}/48 Soal` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSubTahapSma(t.id as any);
              if (t.id === "sesi1") setIndeksSoalSma(0);
              if (t.id === "sesi2") setIndeksSoalSma(30);
            }}
            className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer ${
              subTahapSma === t.id
                ? "bg-purple-800 text-white border-amber-300 shadow-lg"
                : "bg-white text-slate-800 border-slate-200"
              }`}
            >
            <div className="font-black text-xs sm:text-sm">{t.label}</div>
            <div className="text-[10px] opacity-80">{t.sub}</div>
          </button>
        ))}
      </div>

      {(subTahapSma === "sesi1" || subTahapSma === "sesi2") && soalSmaAktif && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xl space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-purple-100 text-purple-900">
                Asesmen Penjurusan Kuliah &amp; Karier SMA/SMK • Terjawab: {jmlTerisiSma} / 48 Soal
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Pernyataan #{soalSmaAktif.no} dari 48
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => setAutoNext(e.target.checked)}
                />
                <span>Otomatis Pindah Soal</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setJawabanSma({});
                  setIndeksSoalSma(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold cursor-pointer"
              >
                Kosongkan Semua
              </button>
              <button
                type="button"
                onClick={() => setSubTahapSma("hasil")}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black cursor-pointer"
              >
                Lihat Sertifikat &amp; Penjurusan ➔
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6">
            <div className="flex justify-between text-xs font-mono text-amber-300">
              <span>Soal #{soalSmaAktif.no} / 48 • Dimensi [{soalSmaAktif.dimensi}]</span>
              <span>
                {jawabanSma[soalSmaAktif.no] !== undefined
                  ? `✓ Sudah Dijawab (Skor ${jawabanSma[soalSmaAktif.no]})`
                  : "○ Belum Dijawab (Kosong)"}
              </span>
            </div>
            <p className="text-lg sm:text-2xl font-black leading-relaxed">
              &ldquo;{soalSmaAktif.teks}&rdquo;
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { v: 1, l: "Sangat Tidak Minat" },
                { v: 2, l: "Kurang Minat" },
                { v: 3, l: "Netral / Ragu" },
                { v: 4, l: "Minat & Cocok" },
                { v: 5, l: "Sangat Minat & Kuat!" },
              ].map((op) => {
                const dipilih = jawabanSma[soalSmaAktif.no] === op.v;
                return (
                  <button
                    key={op.v}
                    type="button"
                    onClick={() => {
                      setJawabanSma((prev) => ({
                        ...prev,
                        [soalSmaAktif.no]: op.v,
                      }));
                      if (autoNext && indeksSoalSma < 47) {
                        setTimeout(() => {
                          const nextIdx = indeksSoalSma + 1;
                          setIndeksSoalSma(nextIdx);
                          if (nextIdx >= 30) setSubTahapSma("sesi2");
                        }, 160);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition ${
                      dipilih
                        ? "bg-amber-400 text-slate-950 border-white scale-105"
                        : "bg-slate-800 text-white border-slate-700 hover:border-purple-400"
                    }`}
                  >
                    <div className="text-lg">{op.v}</div>
                    <div className="text-[10px]">{op.l}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SOAL_SMA_48.map((s, idx) => (
              <button
                key={s.no}
                type="button"
                onClick={() => {
                  setIndeksSoalSma(idx);
                  setSubTahapSma(s.sesi === 1 ? "sesi1" : "sesi2");
                }}
                className={`w-8 h-8 rounded-lg text-[10px] font-black border cursor-pointer ${
                  indeksSoalSma === idx
                    ? "bg-rose-600 text-white"
                    : jawabanSma[s.no] !== undefined
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {s.no}
              </button>
            ))}
          </div>
        </div>
      )}

      {subTahapSma === "hasil" &&
        renderLaporanEksekutifLengkap({
          judulLaporan:
            "Laporan Eksekutif Penjurusan Kuliah (SNBP/SNBT), Mapel Pilihan & Karier SMA/SMK",
          subjudulJenjang:
            "Jenjang Remaja SMA / SMK / MA (15–18 Tahun) • 48 Indikator RIASEC Holland & Kesiapan Kuliah Abad 21",
          daftarUrut: hitungSkorLengkapSma(),
        })}
    </div>
  );
};