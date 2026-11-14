// app/components/simulator/hibahIlmuGuideCatalogData.ts

export interface ItemKatalogFiturSimulator {
  id: string;
  kategori:
    | "Studio Kanvas & Inspector (Tab 1)"
    | "Multi-MCU IDE & Konverter Kode"
    | "Server MQTT, Blynk & HP Android"
    | "Akademi, Instrumen Lab & AIoT (Tab 2)";
  badge: string;
  judulFitur: string;
  deskripsiLengkap: string;
  caraPakaiSingkat: string[];
  kataKunciTargetDom: string[];
  warnaaksen: string;
}

export interface LangkahSpotlightCoachmark {
  langkah: number;
  badgeArea: string;
  judul: string;
  isi: string;
  tipsPraktis: string;
  kataKunciElemenDom: string[];
}

// ============================================================================
// 1. TUR SOROTAN LENGKAP TAB 1 (STUDIO KANVAS — 11 TITIK SOROTAN DETAIL!)
// Mencakup semua bagian di Gambar 1, Gambar 2, dan Gambar 3
// ============================================================================
export const TUR_SPOTLIGHT_TAB_1_STUDIO: LangkahSpotlightCoachmark[] = [
  {
    langkah: 1,
    badgeArea: "BAGIAN 1 • MONITOR SINKRONISASI KODE & CLOUD",
    judul: "1. Bar Sinkronisasi Kode C++ ➔ Rangkaian ➔ MQTT & Blynk",
    isi: "Kotak paling atas ini memeriksa secara real-time apakah Pin GPIO, koneksi Wi-Fi HibahIlmu-Guest, fungsi Publish MQTT, dan Virtual Pin Blynk sudah Anda tulis di dalam kode program.",
    tipsPraktis:
      "Jika indikator masih abu-abu/merah, gunakan tombol suntik kode cepat di bawahnya.",
    kataKunciElemenDom: [
      "MESIN SINKRONISASI KODINGAN C++",
      "1. Pin GPIO di Kodingan:",
    ],
  },
  {
    langkah: 2,
    badgeArea: "BAGIAN 2 • WORKBENCH KREASI, INJEKTOR KODE & LAPORAN .DOCX",
    judul: "2. Suntikkan Snippet Kode Cepat, Live MQTT Tester & Ekspor .DOCX",
    isi: "Di panel Workbench ini, Anda bisa menyuntikkan kode Wi-Fi/MQTT/Blynk dalam 1 klik, menguji pengiriman JSON ke Broker MQTT, membuka Multimeter/Osiloskop, dan mengunduh Dokumentasi Proyek (.docx)!",
    tipsPraktis:
      "Klik tombol biru '📄 Unduh Dokumentasi Proyek Studio (.docx)' kapan saja untuk mencetak laporan lengkap.",
    kataKunciElemenDom: [
      "WORKBENCH KREASI BEBAS",
      "1. Suntikkan Blok Kode Cepat ke Editor Studio:",
    ],
  },
  {
    langkah: 3,
    badgeArea: "BAGIAN 3 • TEMPLATE 7 PROYEK JADI & DENAH RUANGAN GEDUNG",
    judul: "3. Muat 7 Proyek Industri Jadi & Atur Denah Ruangan (Packet Tracer Mode)",
    isi: "Pilih salah satu dari 7 template proyek siap pakai (Lampu Jalan LDR, Smart Door Lock, Greenhouse, Pemadam Api, hingga Triple-MCU) dan aktifkan Denah 2–4 Ruangan untuk menaruh sensor di ruangan berbeda!",
    tipsPraktis:
      "Anda bisa menambahkan ruangan baru (misal: Garasi / Kebun) dan memilih tema warnanya.",
    kataKunciElemenDom: [
      "7 TUTORIAL & CONTOH RANGKAIAN PROJECT JADI",
      "PHYSICAL PACKET TRACER MODE",
    ],
  },
  {
    langkah: 4,
    badgeArea: "BAGIAN 4 • GUDANG 48 KOMPONEN PERANGKAT KERAS",
    judul: "4. Gudang 48 Komponen (MCU, Sensor, Relay, Motor & Baterai)",
    isi: "Berisi 48 jenis perangkat keras lengkap dengan label jumlah kaki pinnya. Tarik (Drag & Drop) komponen yang Anda inginkan langsung ke dalam zona ruangan di meja kanvas bawah!",
    tipsPraktis:
      "Gunakan kotak pencarian 'Cari NPK, Pompa, RFID...' untuk memfilter komponen dengan cepat.",
    kataKunciElemenDom: [
      "GUDANG KOMPONEN (48 ITEM)",
      "Cari NPK, Pompa, RFID",
    ],
  },
  {
    langkah: 5,
    badgeArea: "BAGIAN 5 • TOOLBAR COMPILE, DUPLIKAT & 7 WARNA KABEL",
    judul: "5. Tombol Compile & Run Semua MCU, Duplikat Komponen & Warna Kabel",
    isi: "Gunakan tombol hijau '▶ Compile & Run Semua' untuk menyalakan seluruh mikrokontroler di kanvas, tombol '📋 Duplikat' untuk menggandakan komponen terpilih, dan 7 pilihan warna kabel (Merah, Hitam, Biru, Hijau, Kuning, Ungu, Oranye) agar jalur kabel rapi!",
    tipsPraktis:
      "Klik dulu warna kabel yang diinginkan sebelum menarik garis antar kaki pin di kanvas.",
    kataKunciElemenDom: [
      "Compile & Run Semua",
      "Warna Kabel:",
    ],
  },
  {
    langkah: 6,
    badgeArea: "BAGIAN 6 • KANVAS ZONA RUANGAN & CHIP DAFTAR KABEL",
    judul: "6. Meja Kanvas Multi-Zona & Baris 'Pilih / Edit Kabel'",
    isi: "Di bagian atas meja kanvas terdapat deretan tombol chip 'Pilih / Edit Kabel (#1 SIG➔GPIO4, dst.)'. Klik chip tersebut untuk menyorot atau menghapus kabel tertentu. Di bawahnya adalah meja perakitan dengan dukungan cabang T-Junction dan tekukan kabel fleksibel!",
    tipsPraktis:
      "Geser komponen ke dalam kotak Zona Ruangan (Ruang A / Ruang B) agar terdata di denah gedung.",
    kataKunciElemenDom: [
      "Pilih / Edit Kabel",
      "Taruh MCU / Sensor di dalam zona ini",
    ],
  },
  {
    langkah: 7,
    badgeArea: "BAGIAN 7 • SIDEBAR INSPECTOR, MANUAL OVERRIDE & PINOUT",
    judul: "7. Sidebar Inspector: Lokasi Ruangan, Sakelar Uji Paksa & Info Kaki Pin",
    isi: "Saat Anda mengklik komponen di kanvas, sidebar kanan ini menampilkan: (1) Lokasi Ruangan & Nama Komponen, (2) Tombol Hijau 'STATUS: ON/HIGH' untuk menyalakan/mematikan aktuator secara manual, dan (3) Penjelasan fungsi setiap kaki pinnya (Anoda, Katoda, VCC, GND, SIG)!",
    tipsPraktis:
      "Gunakan tombol 'STATUS: ON / HIGH (AKTIF)' di Inspector untuk menguji apakah LED/Relay/Pompa berfungsi.",
    kataKunciElemenDom: [
      "INSPECTOR & LOKASI RUANGAN",
      "DAFTAR & KETERANGAN PIN",
    ],
  },
  {
    langkah: 8,
    badgeArea: "BAGIAN 8 • MULTI-MCU IDE, KONVERTER MICROPYTHON & LIBRARY",
    judul: "8. Editor Multi-Board, Konverter '⇄ Ubah ke MicroPython' & Library #include",
    isi: "Bagian ini adalah IDE pemrograman untuk setiap board MCU di kanvas (Tab #1, Tab #2, dst.). Dilengkapi tombol emas '⇄ Ubah ke MicroPython' yang menerjemahkan kode C++ ke Python secara otomatis, bar '+ Sisipkan Library Resmi (#include)', serta Serial Monitor di sebelah kanan!",
    tipsPraktis:
      "Klik tombol '+ #include <DHT.h>' atau '+ #include <WiFi.h>' agar tidak salah mengetik nama library.",
    kataKunciElemenDom: [
      "TAB PROGRAM MCU",
      "Sisipkan Library Resmi",
      "COMPILER & MULTI-MCU SERIAL MONITOR",
    ],
  },
  {
    langkah: 9,
    badgeArea: "BAGIAN 9 • SERVER BROKER MANDIRI & GUDANG 16 WIDGET BLYNK",
    judul: "9. Server MQTT/REST Mandiri, Kode ESP32 Fisik & Gudang 16 Widget Blynk",
    isi: "Di bagian ini Anda dapat mengontrol Server Broker Mandiri, membuat kode C++ untuk di-upload ke ESP32 fisik nyata ('</> Buat Kode ESP32 Asli'), serta menarik 16 jenis Widget Blynk (Gauge, Switch, Slider PWM, SuperChart, Telegram, WhatsApp, Joystick, zeRGBa) ke kanvas dashboard!",
    tipsPraktis:
      "Klik atau tarik kartu widget dari Gudang Widget Blynk untuk menambahkannya ke dashboard bawah.",
    kataKunciElemenDom: [
      "Server MQTT/REST Broker Mandiri HibahIlmu",
      "Gudang Widget Blynk (16 Jenis)",
    ],
  },
  {
    langkah: 10,
    badgeArea: "BAGIAN 10 • KANVAS DASHBOARD BLYNK (V0–V3) & HP ANDROID APP",
    judul: "10. Kanvas Widget Virtual Pin (V0..V3) & Layar Blynk Android App Live",
    isi: "Susun kartu widget Virtual Pin (V0 WA Alert, V1 Kadar Gas, V2 Sirine, V3 Pompa) di kanvas kiri, klik '⊞ Rapikan Posisi Widget Otomatis', dan lihat tampilan sinkronnya secara langsung di layar smartphone 'Blynk Android App' di sebelah kanan beserta URL Endpoint API-nya!",
    tipsPraktis:
      "Klik tombol '/unlock', slider, atau sakelar ON/OFF di dalam widget untuk mengirim perintah balik ke rangkaian ESP32.",
    kataKunciElemenDom: [
      "UKURAN KANVAS DASHBOARD BLYNK:",
      "Rapikan Posisi Widget Otomatis",
      "Blynk Android App",
    ],
  },
  {
    langkah: 11,
    badgeArea: "BAGIAN 11 • PILIH BROKER, TOKEN UNIK AKUN & LIVE TRAFFIC",
    judul: "11. Konfigurasi Server Broker, Token Unik Proyek & Penguji Live Traffic",
    isi: "Tiga kotak di bagian paling bawah ini berfungsi untuk: (1) Memilih Broker Web HibahIlmu atau Public HiveMQ beserta Wi-Fi 5G, (2) Menyalin atau mengacak ulang Token Unik Proyek Anda, dan (3) Mengirim perintah uji langsung (seperti '/unlock_solenoid') ke trafik broker!",
    tipsPraktis:
      "Salin Token Unik di kotak tengah jika Anda ingin menghubungkan papan ESP32 asli dari rumah.",
    kataKunciElemenDom: [
      "1. PILIH SERVER MQTT & REST BROKER",
      "2. TOKEN UNIK PROJECT & AKUN INI",
      "3. LIVE TRAFFIC BROKER KITA",
    ],
  },
];

// ============================================================================
// 2. TUR SOROTAN LENGKAP TAB 2 (AKADEMI BELAJAR — 8 TITIK SOROTAN DETAIL!)
// Mencakup semua bagian di Gambar 4 dan Gambar 5
// ============================================================================
export const TUR_SPOTLIGHT_TAB_2_AKADEMI: LangkahSpotlightCoachmark[] = [
  {
    langkah: 1,
    badgeArea: "BAGIAN 1 • PILIH BAHASA (C++ / MICROPYTHON) & MODE LATIHAN",
    judul: "1. Switcher C++ vs MicroPython, Mode Latihan Mandiri (Pin Baru) & Silabus",
    isi: "Pilih bahasa ⚡ C++ Arduino (sketch.ino) atau 🐍 MicroPython (main.py). Gunakan '👁️ Mode Terpandu' untuk panduan berkedip, atau klik '🎯 Latihan Mandiri (Pin Baru!)' untuk mengerjakan studi kasus dengan alokasi Pin GPIO baru tanpa bantuan berkedip!",
    tipsPraktis:
      "Klik tombol Bab 1 s.d. Bab 5 di bawahnya untuk berpindah antar-topik dari Dasar hingga 10-Node Mesh.",
    kataKunciElemenDom: [
      "Akademi IoT HibahIlmu (C++ & MicroPython)",
      "Latihan Mandiri (Pin Baru!)",
    ],
  },
  {
    langkah: 2,
    badgeArea: "BAGIAN 2 • GUDANG 48 KOMPONEN DENGAN SOROTAN BERKEDIP",
    judul: "2. Gudang Komponen Akademi (Tarik Kartu yang Berkedip ke Slot #1..#N)",
    isi: "Pada Mode Terpandu, komponen yang wajib Anda gunakan pada level ini akan menyala berkedip kuning. Tarik (Drag) atau klik komponen tersebut lalu masukkan ke kotak Slot #1 s.d. Slot #N di kanvas bawah!",
    tipsPraktis:
      "Setiap level memiliki variasi jumlah komponen mulai dari 1, 3, 5, 7, hingga 10 komponen sekaligus.",
    kataKunciElemenDom: [
      "Gudang Komponen (Tarik Komponen yang Berkedip",
      "Gudang Komponen — Mode Latihan Mandiri",
    ],
  },
  {
    langkah: 3,
    badgeArea: "BAGIAN 3 • MEJA KANVAS MULTI-SLOT & KABEL SIKU-SIKU 90°",
    judul: "3. Perakitan Multi-Slot, Kabel Siku-Siku & Panel Interaksi Fisik Sensor",
    isi: "Sambungkan semua titik kaki pin menggunakan kabel siku-siku 90°. Ingat: setelah program dijalankan (RUNNING), aktuator TIDAK langsung menyala sendiri! Anda wajib menekan tombol Push Button atau menggeser slider Potensio/LDR/Suhu/Gas agar aktuator bekerja seperti alat aslinya!",
    tipsPraktis:
      "Untuk menghapus 1 kabel yang salah pasang, cukup klik tanda bulat '✕' di tengah kabel tersebut.",
    kataKunciElemenDom: [
      "Slot #1: ESP32 DevKit V1",
      "Kabel Siku-Siku Terpasang",
    ],
  },
  {
    langkah: 4,
    badgeArea: "BAGIAN 4 • MULTIMETER, OSILOSKOP PWM, PLOTTER & BATERAI 18650",
    judul: "4. Instrumen Lab Virtual: Multimeter, Osiloskop, Serial Plotter & Daya",
    isi: "Gunakan panel ini untuk mengukur tegangan & arus di kaki pin mana pun, melihat grafik gelombang kotak PWM di Osiloskop, memantau 4 kurva grafik sensor di Live Serial Plotter, serta menghitung penghematan baterai 18650 dengan mode Deep Sleep!",
    tipsPraktis:
      "Jika Anda menghubungkan 3V3 langsung ke GND atau lupa memasang resistor LED, banner peringatan Korsleting akan muncul di atas panel ini.",
    kataKunciElemenDom: [
      "Instrumen Laboratorium Virtual",
      "1. Multimeter & Osiloskop PWM",
    ],
  },
  {
    langkah: 5,
    badgeArea: "BAGIAN 5 • STEP-BY-STEP DEBUGGER, TESTBENCH & EKSPOR .DOCX",
    judul: "5. Debugger Baris demi Baris, Grader 3 Skenario & Laporan Word (.docx)",
    isi: "Klik '🐢 Jalankan Step-by-Step Debugger' untuk melihat sorotan kuning berjalan baris demi baris di editor kode, klik '🧪 Uji Otomatis 3 Skenario' untuk memvalidasi rangkaian secara menyeluruh, dan klik '📄 Unduh Laporan Praktikum (.docx)' untuk mengunduh laporan resmi!",
    tipsPraktis:
      "Gunakan tombol '⚡ Uji Lompatan Interrupt ISR' untuk melihat bagaimana interupsi perangkat keras bekerja.",
    kataKunciElemenDom: [
      "Jalankan Step-by-Step Debugger",
      "Unduh Laporan Praktikum (.docx)",
    ],
  },
  {
    langkah: 6,
    badgeArea: "BAGIAN 6 • CHAOS 10-NODE MESH, WEBHOOK HP & TINYML EDGE AI",
    judul: "6. Simulator Gangguan Lapangan (Chaos Mesh), Chat HP & TinyML AI",
    isi: "Pada panel Tahap 2 ini (seperti di Gambar 4), Anda bisa mengaktifkan Hujan Badai (-84 dBm), menyuntikkan Noise Sensor, atau mengklik NODE #2..#9 untuk mematikan node dan melihat rute Self-Healing otomatis melompati node yang mati!",
    tipsPraktis:
      "Buka juga tab '2. Smartphone Telegram/WA Live' dan '3. TinyML Edge AI ESP32' di sebelah kanannya.",
    kataKunciElemenDom: [
      "Fitur Lanjutan Tahap 2: Chaos Mesh Injection",
      "Simulator Gangguan Lapangan (Chaos Engineering)",
    ],
  },
  {
    langkah: 7,
    badgeArea: "BAGIAN 7 • CHECKLIST TARGET KODE & TOMBOL '+ SISIPKAN BARIS INI'",
    judul: "7. Panel Asisten Kiri: Teori, Checklist Kabel & Target Ketik Baris demi Baris",
    isi: "Kotak di sebelah kiri bawah (seperti di Gambar 4) menampilkan: (1) Dasar Teori & tombol 'Lihat Skema Gambar', (2) Target Sambungan Kabel Pin, dan (3) Daftar Target Baris Kode yang otomatis berubah hijau ('✓ SUDAH TEPAT') saat diketik, lengkap dengan tombol '+ Sisipkan Baris Ini' dan '👁️ Intip Kode Utuh'!",
    tipsPraktis:
      "Jika malas mengetik manual, klik saja tombol ungu '+ Sisipkan Baris Ini' pada setiap kotak TARGET #1, #2, dst.",
    kataKunciElemenDom: [
      "2. TARGET SAMBUNGAN KABEL PIN",
      "3. PANDUAN KETIK",
    ],
  },
  {
    langkah: 8,
    badgeArea: "BAGIAN 8 • EDITOR KODE, TOMBOL JALANKAN & SERIAL MONITOR",
    judul: "8. Editor Program (sketch.ino / main.py) & Layar Serial Monitor (115200 baud)",
    isi: "Di sebelah kanan terdapat Editor Kode dengan penomor baris, tombol '✨ Bantuan Rakit & Kode', tombol hijau '▶ 1. Periksa Semua Kaki & Jalankan', serta kotak hitam '📟 Serial Monitor & Compiler Output (115200 baud)' di bagian bawahnya (seperti di Gambar 5) yang mencetak hasil eksekusi program!",
    tipsPraktis:
      "Setelah lulus verifikasi, tombol '2. Lanjut Level Berikutnya' di sebelah kanan tombol hijau akan terbuka otomatis.",
    kataKunciElemenDom: [
      "1. Periksa Semua Kaki & Jalankan",
      "Serial Monitor & Compiler Output (115200 baud):",
    ],
  },
];

// ============================================================================
// 3. KATALOG ENSIKLOPEDIA LENGKAP (MENCAKUP SEMUA BAGIAN DI GAMBAR 1–5)
// ============================================================================
export const KATALOG_FITUR_HIBAHILMU_IOT: ItemKatalogFiturSimulator[] = [
  {
    id: "toolbar_compile_warna_chip_kabel",
    kategori: "Studio Kanvas & Inspector (Tab 1)",
    badge: "GAMBAR 1 • KANVAS ATAS",
    judulFitur:
      "Toolbar Compile Multi-MCU, Duplikat, 7 Warna Kabel & Chip 'Pilih / Edit Kabel'",
    deskripsiLengkap:
      "Mengendalikan eksekusi seluruh mikrokontroler sekaligus, menggandakan komponen terpilih, memilih 7 warna kabel standar industri, serta mengedit/menghapus kabel tertentu melalui barisan tombol chip '#1 SIG➔GPIO4', '#2 AO➔GPIO34', dst.",
    caraPakaiSingkat: [
      "Klik salah satu warna pada baris 'Warna Kabel:' sebelum menarik garis kabel di kanvas.",
      "Klik chip kabel pada baris 'Pilih / Edit Kabel' di atas kanvas untuk menyorot jalur kabel tersebut.",
      "Klik tombol hijau '▶ Compile & Run Semua' untuk menyalakan seluruh rangkaian.",
    ],
    kataKunciTargetDom: [
      "Compile & Run Semua",
      "Pilih / Edit Kabel",
    ],
    warnaaksen: "border-emerald-400 bg-emerald-950/25",
  },
  {
    id: "zona_ruangan_dan_sidebar_inspector",
    kategori: "Studio Kanvas & Inspector (Tab 1)",
    badge: "GAMBAR 1 • KANAN KANVAS",
    judulFitur:
      "Zona Ruangan Gedung (365x410px) & Sidebar 'Inspector & Lokasi Ruangan'",
    deskripsiLengkap:
      "Menempatkan MCU dan sensor ke dalam zona ruangan fisik (Ruang Server, Smart Home / Ruang Tamu). Sidebar Inspector di kanan menampilkan lokasi ruangan, pengubah nama komponen, sakelar uji paksa 'STATUS: ON/HIGH (AKTIF)', dan panduan lengkap fungsi 2–4 kaki pin komponen.",
    caraPakaiSingkat: [
      "Klik komponen apa saja di kanvas (misal LED Merah atau Sensor PIR) untuk membuka detailnya di Sidebar Inspector kanan.",
      "Klik tombol hijau '⚡ STATUS: ON / HIGH (AKTIF)' di Inspector untuk mengetes aktuator secara langsung.",
      "Lihat kotak 'ℹ️ DAFTAR & KETERANGAN PIN' di bawahnya untuk mengetahui kaki mana yang harus ke GPIO, VCC, atau GND.",
    ],
    kataKunciTargetDom: [
      "INSPECTOR & LOKASI RUANGAN",
      "DAFTAR & KETERANGAN PIN",
    ],
    warnaaksen: "border-sky-400 bg-sky-950/25",
  },
  {
    id: "multi_mcu_ide_micropython_transpiler",
    kategori: "Multi-MCU IDE & Konverter Kode",
    badge: "GAMBAR 1 & 2 • TENGAH",
    judulFitur:
      "Multi-MCU IDE (Tab per Board), Konverter '⇄ Ubah ke MicroPython' & Library #include",
    deskripsiLengkap:
      "Editor pemrograman yang mendukung banyak board sekaligus (ESP32-C6, ESP32 DevKit, Arduino Uno). Dilengkapi penerjemah otomatis dari C++ ke MicroPython, tombol sisip cepat 7 library resmi (#include <DHT.h>, <TinyGPSPlus.h>, <ESP32Servo.h>, dll.), serta layar Compiler & Multi-MCU Serial Monitor.",
    caraPakaiSingkat: [
      "Klik tombol emas '⇄ Ubah ke MicroPython' untuk mengonversi kode C++ Anda menjadi kode MicroPython secara instan.",
      "Klik tombol '+ #include <...>' untuk menambahkan library resmi ke baris atas editor.",
      "Pantau hasil kompilasi dan jumlah komponen terhubung pada panel '>_ COMPILER & MULTI-MCU SERIAL MONITOR' di sebelah kanan.",
    ],
    kataKunciTargetDom: [
      "TAB PROGRAM MCU",
      "Sisipkan Library Resmi",
      "COMPILER & MULTI-MCU SERIAL MONITOR",
    ],
    warnaaksen: "border-amber-400 bg-amber-950/25",
  },
  {
    id: "server_mqtt_gudang_16_widget_blynk",
    kategori: "Server MQTT, Blynk & HP Android",
    badge: "GAMBAR 2 & 3 • CLOUD IOT",
    judulFitur:
      "Server MQTT/REST Mandiri, Generator Firmware ESP32 Asli & Gudang 16 Widget Blynk",
    deskripsiLengkap:
      "Menjalankan broker IoT mandiri di dalam web, mengekspor kode C++ untuk di-flash ke papan ESP32 fisik ('</> Buat Kode ESP32 Asli'), serta menyediakan 16 jenis Widget Blynk (Gauge, Switch, Slider PWM, SuperChart, Telegram Bot, WhatsApp Gateway, Joystick, zeRGBa) yang bisa ditarik ke kanvas dashboard.",
    caraPakaiSingkat: [
      "Klik tombol kuning '</> Buat Kode ESP32 Asli (Ke Server Kita)' jika ingin menyambungkan alat ESP32 fisik dari dunia nyata.",
      "Klik atau tarik widget dari 'Gudang Widget Blynk (16 Jenis)' untuk menambahkannya ke dashboard Virtual Pin (V0..V10).",
    ],
    kataKunciTargetDom: [
      "Server MQTT/REST Broker Mandiri HibahIlmu",
      "Gudang Widget Blynk (16 Jenis)",
    ],
    warnaaksen: "border-purple-400 bg-purple-950/25",
  },
  {
    id: "kanvas_blynk_hp_android_dan_3_kotak_broker",
    kategori: "Server MQTT, Blynk & HP Android",
    badge: "GAMBAR 3 • DASHBOARD BAWAH",
    judulFitur:
      "Kanvas Widget Virtual Pin (V0–V3), Mockup HP Android & 3 Panel Konfigurasi Broker",
    deskripsiLengkap:
      "Mengatur ukuran dan merapikan posisi widget Virtual Pin secara otomatis, menyinkronkannya secara live dengan layar 'Blynk Android App' di kanan (lengkap dengan URL Endpoint API), serta mengelola Server Broker, Token Unik Akun, dan pengiriman perintah Live Traffic ('/unlock_solenoid').",
    caraPakaiSingkat: [
      "Klik tombol ungu '⊞ Rapikan Posisi Widget Otomatis' untuk menyusun kartu V0, V1, V2, V3 dengan rapi.",
      "Gunakan 3 kotak di bagian paling bawah untuk menyalin Token Unik Proyek atau mengetes kirim perintah di '3. LIVE TRAFFIC BROKER KITA'.",
    ],
    kataKunciTargetDom: [
      "Rapikan Posisi Widget Otomatis",
      "1. PILIH SERVER MQTT & REST BROKER",
      "3. LIVE TRAFFIC BROKER KITA",
    ],
    warnaaksen: "border-teal-400 bg-teal-950/25",
  },
  {
    id: "chaos_mesh_checklist_kode_serial_akademi",
    kategori: "Akademi, Instrumen Lab & AIoT (Tab 2)",
    badge: "GAMBAR 4 & 5 • AKADEMI",
    judulFitur:
      "Chaos 10-Node Self-Healing Mesh, Checklist Target Kode '+ Sisipkan Baris' & Serial Monitor",
    deskripsiLengkap:
      "Di Tab 2 (Akademi), Anda dapat menguji ketahanan jaringan 10-Node terhadap Hujan Badai & Node Mati, mengikuti Checklist Target Baris Kode yang berubah hijau otomatis saat diketik (atau klik '+ Sisipkan Baris Ini'), menggunakan Multimeter/Osiloskop/Debugger, dan memantau 'Serial Monitor & Compiler Output (115200 baud)'.",
    caraPakaiSingkat: [
      "Klik tombol 'NODE #2..#9' pada panel Chaos Engineering untuk melihat rute estafet melompati node yang mati.",
      "Klik tombol ungu '+ Sisipkan Baris Ini' pada kotak TARGET #1, #2, dst. untuk menyisipkan baris kode yang tepat ke editor.",
      "Lihat hasil eksekusi dan pesan compiler pada kotak hitam '📟 Serial Monitor & Compiler Output (115200 baud)' di kanan bawah.",
    ],
    kataKunciTargetDom: [
      "Simulator Gangguan Lapangan (Chaos Engineering)",
      "3. PANDUAN KETIK",
      "Serial Monitor & Compiler Output (115200 baud):",
    ],
    warnaaksen: "border-rose-400 bg-rose-950/25",
  },
];