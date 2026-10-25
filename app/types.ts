// app/types.ts

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

export interface FlashcardItem {
  id: string;
  depan: string;
  belakang: string;
  levelPenguasaan?: "ulangi" | "cukup" | "mahir";
}

export interface UlasanMateriItem {
  id: string;
  siswaNama: string;
  bintang: number;
  komentar: string;
  waktu: string;
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

export interface BabModulItem {
  id: string;
  judulBab: string;
  durasiBab: string;
  videoUrl?: string;
  kontenHtml: string;
  rumusMatematika?: string;
}

export type JenisTugasTipe =
  | "Esai Analisis"
  | "Proyek Coding / IT"
  | "Laporan Praktikum"
  | "Presentasi / Video"
  | "Resume Jurnal";

export interface TugasItem {
  id: string;
  subJenjangId: string;
  modulId?: string;
  judul: string;
  jenisTugas?: JenisTugasTipe;
  instruksi: string;
  waktuBuka?: string;
  waktuTutup?: string;
  deadline: string;
  pembuatNama: string;
  kriteriaRubrik?: string[];
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
  prasyaratKelasId?: string;
  syaratSkorMinimal?: number;
  jadwalBukaKuis?: string;
  jadwalTutupKuis?: string;
  kuisBolehMundur?: boolean;
  kuisPakaiCoratCoret?: boolean;
  daftarBab?: BabModulItem[];
  daftarTugasModul?: TugasItem[];
  durasi: string;
  videoUrl: string;
  lampiranUrl?: string;
  rangkuman: string;
  rumusMatematika?: string;
  daftarKuis: KuisItem[];
  flashcards?: FlashcardItem[];
  ulasan?: UlasanMateriItem[];
  kategori?: string;
  contohKode?: string;
  kuis?: KuisItem[];
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

export type TipeUjianCBT =
  | "Pilihan Ganda"
  | "Esai Komprehensif"
  | "Campuran (PG + Esai)"
  | "CBT Algoritmik";

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
  jadwalBukaSesi?: string;
  jadwalTutupSesi?: string;
  durasiMenit: number;
  tipeUjian?: TipeUjianCBT;
  bolehMundur?: boolean;
  izinkanKeyboard?: boolean;
  pakaiCoratCoret?: boolean;
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

export interface PengumpulanTugas {
  id: string;
  tugasId: string;
  siswaId: string;
  siswaNama: string;
  jawabanTeksAtauLink: string;
  waktuKumpul: string;
  nilai?: number;
  feedbackGuru?: string;
  rincianRubrikAi?: {
    argumen: number;
    tataBahasa: number;
    referensi: number;
    catatanAi: string;
  };
}

export interface RppItem {
  id: string;
  judulRpp: string;
  mataPelajaran: string;
  jenjangKelas: string;
  kurikulum: "Kurikulum Merdeka" | "K13 Revisi" | "Silabus Kampus / RPS";
  pembuatNama: string;
  ringkasanTujuan: string;
  fileUrl: string;
  jumlahUnduhan: number;
  tanggalUpload: string;
}

export interface OfficeHourItem {
  id: string;
  namaAhli: string;
  keahlian: string;
  topikBahasan: string;
  jadwalHariJam: string;
  meetingUrl: string;
  antreanPertanyaan: { namaSiswa: string; pertanyaan: string }[];
}

export interface PresensiItem {
  id: string;
  siswaId: string;
  siswaNama: string;
  materiJudul: string;
  waktuHadir: string;
  metode?: "Otomatis Modul" | "Scan QR Ujian";
}

export interface JadwalLiveItem {
  id: string;
  judulSesi: string;
  pengajarNama: string;
  tanggalJam: string;
  meetingUrl: string;
  targetKelas: string;
}

// FITUR BARU: Agenda Kegiatan, Webinar & Live Streaming Nasional
export interface AgendaWebinarItem {
  id: string;
  judulAcara: string;
  kategoriAcara:
    | "Webinar Nasional"
    | "Live Streaming Kelas"
    | "Workshop Guru & Dosen"
    | "Tryout Akbar Nasional";
  narasumber: string;
  tanggalWaktu: string; // Format ISO "2026-10-26T19:00"
  platform: "YouTube Live" | "Zoom Meeting" | "Google Meet";
  streamAtauJoinUrl: string;
  targetPeserta: "Semua (Pengajar & Pelajar)" | "Khusus Pengajar" | "Khusus Pelajar/Mahasiswa";
  sedangLive?: boolean;
  kuotaPeserta?: number;
  pesertaTerdaftarIds?: string[];
}

export interface StudyRoomItem {
  id: string;
  namaGrup: string;
  topikFokus: string;
  kodeUndangan: string;
  pembuatNama: string;
  anggotaNama: string[];
  catatanBersama: string;
  pesanDiskusi: { pengirim: string; isi: string; waktu: string }[];
}

export interface PengajuanBeasiswaItem {
  id: string;
  pemohonId: string;
  pemohonNama: string;
  jenisBeasiswa:
    | "Beasiswa Prestasi Sains"
    | "Bantuan Kuota & Alat Belajar"
    | "Beasiswa Riset Mahasiswa";
  alasanPengajuan: string;
  nilaiRataRata: number;
  status: "Menunggu Verifikasi" | "Disetujui" | "Ditolak";
  tanggalAjuan: string;
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
  waktu: string;
  likes: number;
  solved: boolean;
  jawaban: JawabanDiskusi[];
}

export interface DonasiItem {
  id: string;
  namaDonatur: string;
  nominal: number;
  pesan: string;
  waktu: string;
  namaAnonim?: string;
}

export interface TransparansiDonasi {
  totalTerkumpul: number;
  targetTahunan: number;
  alokasiPenggunaan: {
    kategori: string;
    persentase: number;
    nominal: number;
  }[];
  riwayatDonatur: DonasiItem[];
}

export interface KaryaPortofolioSiswa {
  id: string;
  judulKarya: string;
  kategori: string;
  deskripsi: string;
  linkKarya: string;
  tanggal: string;
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
  karyaPublik?: KaryaPortofolioSiswa[];
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
  targetUserId: string; // ID User atau "ALL" atau "GURU" atau "SISWA"
  tipeNotif?: "tugas_deadline" | "kuis_tutup" | "webinar_live" | "info_umum";
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