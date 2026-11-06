// app/components/talent-mapping/multiJenjangQuestionsData.ts

export interface DimensiScoreItem {
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

export const DEFINISI_8_DIMENSI_ANAK: Record<
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

export const KARTU_VISUAL_ANAK_24 = [
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
  {
    id: 17,
    pertanyaan: "17. Kalau diajak membuat pertunjukan di rumah, kamu ingin tampil sebagai apa?",
    opsi: [
      { kode: "musik", ikon: "🎤", teks: "Penyanyi atau Pemain Alat Musik" },
      { kode: "bahasa", ikon: "🎭", teks: "Pendongeng Cerita atau Pembawa Acara" },
      { kode: "seni", ikon: "🎪", teks: "Pembuat Dekorasi Panggung & Kostum" },
      { kode: "fisik", ikon: "🥋", teks: "Peraga Gerakan Bela Diri, Senam atau Sulap Gerak" },
    ],
  },
  {
    id: 18,
    pertanyaan: "18. Saat melihat semut berbaris atau burung terbang, apa yang kamu lakukan?",
    opsi: [
      { kode: "alam", ikon: "🔍", teks: "Mengamati dari Dekat ke Mana Mereka Pergi" },
      { kode: "logika", ikon: "🤔", teks: "Menghitung Jumlahnya & Bertanya Kenapa Bisa Terbang" },
      { kode: "seni", ikon: "✏️", teks: "Menggambar Bentuk Burung & Semut Itu di Kertas" },
      { kode: "sosial", ikon: "📢", teks: "Memanggil Teman-Teman untuk Melihat Bersama" },
    ],
  },
  {
    id: 19,
    pertanyaan: "19. Permainan papan (board game) atau kartu seperti apa yang kamu sukai?",
    opsi: [
      { kode: "logika", ikon: "♟️", teks: "Tebak Strategi, Catur Anak, Ular Tangga Angka" },
      { kode: "bahasa", ikon: "🔤", teks: "Kartu Tebak Kata, Huruf & Cerita Gambar" },
      { kode: "seni", ikon: "🃏", teks: "Kartu Mencocokkan Warna & Gambar Kembar" },
      { kode: "sosial", ikon: "🎲", teks: "Permainan Tepuk Tangan Rame-Rame Sekeluarga" },
    ],
  },
  {
    id: 20,
    pertanyaan: "20. Kalau kamu punya waktu luang di pagi hari yang cerah, kamu pilih apa?",
    opsi: [
      { kode: "fisik", ikon: "🤸", teks: "Senam Pagi, Loncat-Loncat & Bersepeda" },
      { kode: "alam", ikon: "🪴", teks: "Memberi Makan Ikan/Burung & Menyiram Bunga" },
      { kode: "musik", ikon: "📻", teks: "Menyalakan Lagu Anak-Anak & Ikut Bernyanyi" },
      { kode: "mandiri", ikon: "👕", teks: "Memilih Baju Sendiri & Merapikan Tas Sekolah" },
    ],
  },
  {
    id: 21,
    pertanyaan: "21. Benda mana di bawah ini yang paling membuatmu penasaran ingin mencoba?",
    opsi: [
      { kode: "logika", ikon: "🔭", teks: "Teropong Bintang, Kompas & Magnet" },
      { kode: "musik", ikon: "🎻", teks: "Biola, Seruling, Pianika & Angklung" },
      { kode: "seni", ikon: "📷", teks: "Kamera Foto Anak & Tanah Liat warna-warni" },
      { kode: "fisik", ikon: "🏹", teks: "Busur Panahan Mainan & Papan Seluncur" },
    ],
  },
  {
    id: 22,
    pertanyaan: "22. Saat mendengarkan cerita sebelum tidur, bagian mana yang paling kamu suka?",
    opsi: [
      { kode: "bahasa", ikon: "🗣️", teks: "Menirukan Suara Tokoh-Tokoh di Dalam Cerita" },
      { kode: "seni", ikon: "🎨", teks: "Melihat Detail Gambar Ilustrasi di Tiap Halaman" },
      { kode: "sosial", ikon: "❤️", teks: "Kisah Persahabatan Tokoh yang Saling Menolong" },
      { kode: "mandiri", ikon: "🦸", teks: "Tokoh Anak Pemberani yang Berhasil Mandiri" },
    ],
  },
  {
    id: 23,
    pertanyaan: "23. Kalau bermain air atau pasir di pantai, apa yang paling seru dilakukan?",
    opsi: [
      { kode: "seni", ikon: "🏰", teks: "Membangun Istana Pasir & Menghiasnya dengan Kerang" },
      { kode: "fisik", ikon: "🌊", teks: "Berenang, Melompati Ombak Kecil & Berlari" },
      { kode: "alam", ikon: "🦀", teks: "Mencari Kepiting Kecil, Ikan & Bintang Laut" },
      { kode: "logika", ikon: "🪣", teks: "Membuat Saluran Air & Mengukur Kedalaman Kolam Pasir" },
    ],
  },
  {
    id: 24,
    pertanyaan: "24. Setelah selesai mengerjakan karya yang bagus, apa yang ingin kamu lakukan?",
    opsi: [
      { kode: "mandiri", ikon: "⭐", teks: "Menyimpannya dengan Rapi di Tempat Khususku" },
      { kode: "sosial", ikon: "👨‍👩‍👧", teks: "Memamerkannya ke Ayah, Ibu & Teman-Teman" },
      { kode: "bahasa", ikon: "📢", teks: "Menceritakan Panjang Lebar Cara Aku Membuatnya" },
      { kode: "musik", ikon: "💃", teks: "Menari & Bernyanyi Gembira Karena Sudah Selesai" },
    ],
  },
];

export const OBSERVASI_ORTU_24 = [
  { id: "ob1", kategori: "seni", teks: "Anak gemar menggambar, memadukan banyak warna, dan imajinatif saat membuat bentuk dari plastisin/kertas." },
  { id: "ob2", kategori: "seni", teks: "Anak peka terhadap detail visual (mudah mengenali perbedaan gambar, letak benda, atau keindahan warna)." },
  { id: "ob3", kategori: "seni", teks: "Anak suka menata mainannya berdasarkan keindahan warna/bentuk dan menyukai buku yang kaya ilustrasi." },
  { id: "ob4", kategori: "fisik", teks: "Anak sangat aktif bergerak (berlari, melompat, memanjat) dengan keseimbangan tubuh yang tangkas." },
  { id: "ob5", kategori: "fisik", teks: "Koordinasi motorik halus tangannya terampil (menggunting, memegang pensil, merakit benda kecil, atau menangkap bola)." },
  { id: "ob6", kategori: "fisik", teks: "Anak lebih cepat paham jika diajarkan melalui gerakan tubuh atau praktik langsung dibandingkan hanya mendengar." },
  { id: "ob7", kategori: "logika", teks: "Anak suka bertanya 'mengapa/bagaimana cara kerjanya' dan tertarik pada eksperimen sains atau benda mekanis." },
  { id: "ob8", kategori: "logika", teks: "Anak cepat memahami konsep angka, pola urutan, pengelompokan benda, atau menyukai permainan puzzle/lego." },
  { id: "ob9", kategori: "logika", teks: "Saat menghadapi mainan yang macet atau sulit, anak berusaha mencari akal untuk memperbaikinya dulu sebelum menyerah." },
  { id: "ob10", kategori: "musik", teks: "Anak mudah menghafal nada lagu dan peka mengenali apakah suatu nada/suara terdengar harmonis." },
  { id: "ob11", kategori: "musik", teks: "Anak sering bersenandung, bernyanyi sendiri, atau mengetuk-ngetukkan jari mengikuti irama musik." },
  { id: "ob12", kategori: "musik", teks: "Suasana hati dan semangat belajar anak langsung meningkat drastis ketika diputarkan musik/lagu ceria." },
  { id: "ob13", kategori: "bahasa", teks: "Anak memiliki perbendaharaan kata yang kaya untuk anak seusianya dan pandai merangkai cerita panjang." },
  { id: "ob14", kategori: "bahasa", teks: "Anak senang mendengarkan buku cerita, cepat menghafal kosakata baru/doa, dan berani berbicara." },
  { id: "ob15", kategori: "bahasa", teks: "Anak gemar menirukan dialog tokoh cerita dan ekspresif saat menyampaikan keinginannya secara lisan." },
  { id: "ob16", kategori: "sosial", teks: "Anak mudah akrab dengan teman sebaya, senang bermain bersama, dan sering mengajak/mengatur permainan." },
  { id: "ob17", kategori: "sosial", teks: "Anak menunjukkan empati yang tinggi (peka menolong, menghibur, atau berbagi saat melihat teman sedih)." },
  { id: "ob18", kategori: "sosial", teks: "Anak berani tampil di depan keluarga atau kelas (misal: bernyanyi, menyapa, atau menunjukkan karyanya)." },
  { id: "ob19", kategori: "alam", teks: "Anak sangat antusias berinteraksi dengan hewan peliharaan, mengamati serangga/tumbuhan, dan bermain di alam." },
  { id: "ob20", kategori: "alam", teks: "Anak suka mengumpulkan benda-benda alam (daun, batu unik, kerang) dan peduli pada tanaman/hewan." },
  { id: "ob21", kategori: "alam", teks: "Anak sering memperhatikan perubahan cuaca, langit, awan, atau bertanya tentang kehidupan hewan dan pohon." },
  { id: "ob22", kategori: "mandiri", teks: "Anak mampu berkonsentrasi menyelesaikan permainannya atau tugasnya sendiri tanpa harus terus-menerus ditunggui." },
  { id: "ob23", kategori: "mandiri", teks: "Anak memiliki kemauan yang jelas, mandiri dalam rutinitas harian (makan/merapikan mainan), dan percaya diri." },
  { id: "ob24", kategori: "mandiri", teks: "Anak mampu menenangkan dirinya kembali dengan cukup baik setelah mengalami kekecewaan kecil saat bermain." },
];

export const DEFINISI_8_BAKAT_SMP: Record<
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
      "Kamu tidak harus menjadi atlet olahraga berat! Cukup pilih olahraga ringan yang menyenangkan seperti berenang santai, jalan cepat, bersepeda pagi, atau peregangan 15 menit sehari agar tubuhmu tetap bugar.",
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

export const SOAL_SMP_36 = [
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

export const DEFINISI_6_RIASEC_SMA: Record<
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

export const SOAL_SMA_48 = [
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