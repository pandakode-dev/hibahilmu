"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Database,
  Briefcase,
  Download,
  LogOut,
  Wand2,
  FolderArchive,
  Users,
  Timer,
  GitBranch,
  Layers,
  Calendar,
} from "lucide-react";
import {
  AkunPengguna,
  JenjangItem,
  KuisItem,
  TipeSoal,
  PaketTryout,
  SoalTryout,
  TugasItem,
  JenisTugasTipe,
  PengumpulanTugas,
  PresensiItem,
  RppItem,
  KelompokBelajar,
  JadwalLiveItem,
  StudyRoomItem,
  PengajuanBeasiswaItem,
  LogAktivitas,
  KelasItem,
  BabModulItem,
  RiwayatPercobaanTryout,
} from "../types";
import { bersihkanTagHtml, TEMPLATE_CSV_KUIS } from "../mockData";
import { RichTextEditorPro } from "./RichTextEditorPro";
import { ProfilCVSection } from "./dashboard/ProfilCVSection";
import { AdminPanelSection } from "./dashboard/AdminPanelSection";
import { SiswaPortalSection } from "./dashboard/SiswaPortalSection";
import { GuruTryoutQrSection } from "./dashboard/GuruTryoutQrSection";
import { GuruLainnyaSection } from "./dashboard/GuruLainnyaSection";

interface DashboardPanelProps {
  userLogin: AkunPengguna | null;
  setUserLogin: (u: AkunPengguna | null) => void;
  daftarAkun: AkunPengguna[];
  setDaftarAkun: (list: AkunPengguna[]) => void;
  daftarJenjang: JenjangItem[];
  setDaftarJenjang: React.Dispatch<React.SetStateAction<JenjangItem[]>>;
  daftarPaketTryout: PaketTryout[];
  setDaftarPaketTryout: (list: PaketTryout[]) => void;
  riwayatTryout: RiwayatPercobaanTryout[];
  daftarTugas: TugasItem[];
  setDaftarTugas: (list: TugasItem[]) => void;
  daftarPengumpulan: PengumpulanTugas[];
  setDaftarPengumpulan: React.Dispatch<React.SetStateAction<PengumpulanTugas[]>>;
  daftarPresensi: PresensiItem[];
  setDaftarPresensi: React.Dispatch<React.SetStateAction<PresensiItem[]>>;
  rppList: RppItem[];
  setRppList: React.Dispatch<React.SetStateAction<RppItem[]>>;
  bankSoalKolektif: SoalTryout[];
  setBankSoalKolektif: (list: SoalTryout[]) => void;
  daftarKelompok: KelompokBelajar[];
  setDaftarKelompok: (list: KelompokBelajar[]) => void;
  jadwalLive: JadwalLiveItem[];
  setJadwalLive: (list: JadwalLiveItem[]) => void;
  studyRooms: StudyRoomItem[];
  setStudyRooms: (list: StudyRoomItem[]) => void;
  daftarBeasiswa: PengajuanBeasiswaItem[];
  setDaftarBeasiswa: (list: PengajuanBeasiswaItem[]) => void;
  logAktivitas: LogAktivitas[];
  poinXP: number;
  materiSelesai: string[];
  tambahXP: (xp: number) => void;
  kirimNotifikasiKeUser: (
    targetIds: string[],
    judul: string,
    pesan: string,
    pengirim: string,
    namaKelas?: string
  ) => void;
  modeRoleAwalAuth?: "siswa" | "guru";
}

export const DashboardPanelView: React.FC<DashboardPanelProps> = ({
  userLogin,
  setUserLogin,
  daftarAkun,
  setDaftarAkun,
  daftarJenjang,
  setDaftarJenjang,
  daftarPaketTryout,
  setDaftarPaketTryout,
  riwayatTryout,
  daftarTugas,
  setDaftarTugas,
  daftarPengumpulan,
  setDaftarPengumpulan,
  daftarPresensi,
  setDaftarPresensi,
  rppList,
  setRppList,
  bankSoalKolektif,
  setBankSoalKolektif,
  daftarKelompok,
  setDaftarKelompok,
  jadwalLive,
  setJadwalLive,
  studyRooms,
  daftarBeasiswa,
  setDaftarBeasiswa,
  logAktivitas,
  poinXP,
  materiSelesai,
  tambahXP,
  kirimNotifikasiKeUser,
  modeRoleAwalAuth = "siswa",
}) => {
  const [modeAuth, setModeAuth] = useState<"login" | "register">("login");
  const [roleReg, setRoleReg] = useState<"siswa" | "guru">(modeRoleAwalAuth);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [namaReg, setNamaReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [pesanSukses, setPesanSukses] = useState("");

  const [adminModeGuru, setAdminModeGuru] = useState(false);

  const [guruTabAktif, setGuruTabAktif] = useState<
    | "materi"
    | "rantai_modul"
    | "tryout_qr"
    | "tugas_rubrik"
    | "analitik"
    | "bank_soal"
    | "rombel_live"
    | "rpp_repo"
    | "cv"
  >("materi");

  // State Form Modul, Jadwal Kuis, & Tugas Modul
  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [levelMateri, setLevelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [prasyaratKelasPilih, setPrasyaratKelasPilih] = useState<string>("");
  const [syaratSkorMinimalInput, setSyaratSkorMinimalInput] = useState<number>(80);

  // Jadwal Buka-Tutup Sesi Kuis Modul & Aturan Kuis
  const [jadwalBukaKuisInput, setJadwalBukaKuisInput] = useState("2026-10-20T08:00");
  const [jadwalTutupKuisInput, setJadwalTutupKuisInput] = useState("2026-12-31T23:59");
  const [kuisBolehMundurInput, setKuisBolehMundurInput] = useState(true);
  const [kuisPakaiCoratCoretInput, setKuisPakaiCoratCoretInput] = useState(true);

  const [videoMateri, setVideoMateri] = useState("");
  const [lampiranMateri, setLampiranMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [notifGuru, setNotifGuru] = useState(false);
  const [bukaModalImportCsvKuis, setBukaModalImportCsvKuis] = useState(false);
  const [teksCsvKuis, setTeksCsvKuis] = useState(TEMPLATE_CSV_KUIS);

  // State Daftar Tugas Modul Lengkap dengan Jenis Tugas & Waktu Buka/Tutup Pengumpulan
  const [daftarTugasModulDraft, setDaftarTugasModulDraft] = useState<
    {
      id: string;
      judul: string;
      jenisTugas: JenisTugasTipe;
      instruksi: string;
      waktuBuka: string;
      waktuTutup: string;
    }[]
  >([
    {
      id: "tgs-draft-1",
      judul: "Tugas Praktik Mandiri Modul Ini",
      jenisTugas: "Esai Analisis",
      instruksi:
        "Buatlah analisis singkat atau laporan hasil eksperimen dari materi modul ini beserta kesimpulannya.",
      waktuBuka: "2026-10-20T08:00",
      waktuTutup: "2026-12-31T23:59",
    },
  ]);

  const [daftarBabDraft, setDaftarBabDraft] = useState<BabModulItem[]>([
    {
      id: "bab-draft-1",
      judulBab: "Bab 1: Konsep Dasar & Pengantar Modul",
      durasiBab: "10 Menit",
      videoUrl: "",
      kontenHtml: "<p>Tuliskan penjelasan lengkap untuk Bab 1 di sini...</p>",
    },
    {
      id: "bab-draft-2",
      judulBab: "Bab 2: Studi Kasus & Implementasi Lanjut",
      durasiBab: "15 Menit",
      videoUrl: "",
      kontenHtml: "<p>Tuliskan penjelasan lengkap untuk Bab 2 di sini...</p>",
    },
  ]);

  const [daftarKuisDraft, setDaftarKuisDraft] = useState<KuisItem[]>([
    {
      id: "draft-1",
      tipe: "pilihan_ganda",
      tanya: "",
      opsi: ["", "", "", ""],
      jawabanBenar: 0,
      pembahasan: "",
      poin: 50,
    },
  ]);

  const [soalTryoutDraft, setSoalTryoutDraft] = useState<SoalTryout[]>([
    {
      id: "td-1",
      pertanyaan: "Contoh Pertanyaan Tryout",
      opsi: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      jawabanBenar: 0,
      pembahasan: "Pembahasan soal",
    },
  ]);

  const semuaSubJenjangFlat = daftarJenjang.flatMap((j) =>
    j.subJenjang.map((sj) => ({ ...sj, namaInduk: j.nama }))
  );

  const semuaModulFlat = daftarJenjang.flatMap((j) =>
    j.kelas.map((k) => ({ ...k, namaJenjang: j.nama }))
  );

  const handleDownloadRekapCsvExcel = () => {
    const header =
      "Tipe Rekap,Nama Pelajar,Judul Tugas atau Ujian,Skor Nilai,Status atau Feedback,Waktu\n";
    const barisTugas = daftarPengumpulan.map(
      (sub) =>
        `Tugas Kelas,"${sub.siswaNama}","${
          daftarTugas.find((t) => t.id === sub.tugasId)?.judul || "Tugas"
        }",${sub.nilai ?? "Belum Dinilai"},"${sub.feedbackGuru || "-"}","${sub.waktuKumpul}"`
    );
    const barisTryout = riwayatTryout.map(
      (rw) =>
        `Tryout CBT,"${rw.userNama}","${rw.paketJudul}",${rw.skor},"${rw.statusAkhir}","${rw.waktuSelesai}"`
    );

    const csvContent = header + [...barisTugas, ...barisTryout].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Rekap_Nilai_Rapor_HibahIlmu_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAiGenerateQuiz = () => {
    const teks = bersihkanTagHtml(rangkumanMateri).trim();
    const topik = judulMateri.trim() || "Materi Pembelajaran";
    const kalimat = teks
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
    const fakta1 = kalimat[0] || `Konsep utama pada ${topik} sangat penting dikuasai.`;

    setDaftarKuisDraft([
      {
        id: "ai-1-" + Date.now(),
        tipe: "pilihan_ganda",
        tanya: `[AI Generated] Berdasarkan materi "${topik}", manakah pernyataan yang paling tepat?`,
        opsi: [
          fakta1.slice(0, 85),
          "Tidak memiliki kaitan dengan variabel utama",
          "Hanya berlaku pada sistem tertutup",
          "Semua pernyataan keliru",
        ],
        jawabanBenar: 0,
        pembahasan: `Sesuai rangkuman: ${fakta1}`,
        poin: 50,
      },
      {
        id: "ai-2-" + Date.now(),
        tipe: "benar_salah",
        tanya: `[AI Generated] Benar atau Salah: "${fakta1.slice(0, 90)}" merupakan bagian dari konsep ${topik}?`,
        opsi: ["Benar", "Salah"],
        jawabanBenar: 0,
        pembahasan: `Pernyataan tersebut benar sesuai materi ${topik}.`,
        poin: 40,
      },
      {
        id: "ai-3-" + Date.now(),
        tipe: "mencocokkan",
        tanya: `[AI Generated] Pasangkan konsep berikut dengan definisi yang tepat pada topik "${topik}"!`,
        opsi: [],
        jawabanBenar: 0,
        pasangan: [
          { kiri: `Topik Utama Modul`, kanan: topik },
          { kiri: `Poin Inti Pembahasan`, kanan: fakta1.slice(0, 50) },
        ],
        pembahasan: `Pasangan konsep dan definisi telah sesuai dengan rangkuman ${topik}.`,
        poin: 70,
      },
      {
        id: "ai-4-" + Date.now(),
        tipe: "isian_singkat",
        tanya: `[AI Generated] Sebutkan topik atau kata kunci utama dari modul pembelajaran ini!`,
        opsi: [],
        jawabanBenar: 0,
        jawabanTeks: topik.toLowerCase(),
        pembahasan: `Kata kunci utama modul ini adalah ${topik}.`,
        poin: 60,
      },
    ]);
    alert("⚡ AI Quiz Generator berhasil menyusun 4 soal lengkap dari rangkuman Anda!");
  };

  // 1. GERBANG LOGIN & REGISTRASI
  if (!userLogin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 shadow-xl border">
          <div className="p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-900 font-semibold flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>
              <b>100% Gratis &amp; Terverifikasi:</b> Wajib registrasi dan masuk agar setiap materi,
              rantai modul bersyarat, dan sertifikat dapat dipertanggungjawabkan.
            </span>
          </div>

          <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setModeAuth("login")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold ${
                modeAuth === "login" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => setModeAuth("register")}
              className={`flex-1 py-3.5 rounded-xl text-sm font-extrabold ${
                modeAuth === "register" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              Registrasi Akun Gratis
            </button>
          </div>

          {pesanError && (
            <div className="mb-4 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-sm font-bold">
              {pesanError}
            </div>
          )}
          {pesanSukses && (
            <div className="mb-4 p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-sm font-bold">
              {pesanSukses}
            </div>
          )}

          {modeAuth === "login" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const found = daftarAkun.find(
                  (a) =>
                    a.email.toLowerCase() === emailLogin.toLowerCase() &&
                    a.password === passwordLogin
                );
                if (!found) return setPesanError("Email atau Password salah.");
                if (found.status !== "approved")
                  return setPesanError("Akun sedang menunggu persetujuan Admin.");
                setUserLogin(found);
              }}
              className="space-y-4"
            >
              <input
                type="email"
                required
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Email Terdaftar..."
                className="w-full p-4 bg-slate-50 border rounded-2xl text-base font-semibold"
              />
              <input
                type="password"
                required
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                placeholder="Password..."
                className="w-full p-4 bg-slate-50 border rounded-2xl text-base font-semibold"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg text-base"
              >
                Masuk Sekarang
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const baru: AkunPengguna = {
                  id: "usr-" + Date.now(),
                  nama: namaReg,
                  email: emailReg,
                  password: passwordReg,
                  role: roleReg,
                  status: "pending",
                  infoTambahan: roleReg === "guru" ? "Pengajar Kontributor" : "Pelajar Terdaftar",
                  waktuDaftar: "Baru saja",
                  xp: 100,
                  aksesMengajar: ["sma-11-ipa", "pt-ti"],
                  minatSubJenjang: ["sma-11-ipa", "pt-ti"],
                };
                setDaftarAkun([baru, ...daftarAkun]);
                setPesanSukses("Pendaftaran terkirim! Menunggu verifikasi Admin.");
                setModeAuth("login");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleReg("siswa")}
                  className={`p-4 border-2 rounded-2xl text-left ${
                    roleReg === "siswa" ? "bg-emerald-50 border-emerald-500" : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-base">Siswa / Mahasiswa</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleReg("guru")}
                  className={`p-4 border-2 rounded-2xl text-left ${
                    roleReg === "guru" ? "bg-indigo-50 border-indigo-500" : "border-slate-200"
                  }`}
                >
                  <div className="font-extrabold text-base">Guru / Penyumbang Ilmu</div>
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
            Simulasi Login Cepat (1-Klik)
          </span>
          <h3 className="text-2xl font-black mt-4 mb-2">Pilih Akun Terverifikasi</h3>
          <div className="space-y-3 mt-3">
            {daftarAkun
              .filter((a) => a.status === "approved")
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => setUserLogin(a)}
                  className="w-full text-left p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition flex items-center justify-between cursor-pointer"
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
  }

  // 2. PANEL SUPER ADMIN
  if (userLogin.role === "admin" && !adminModeGuru) {
    return (
      <AdminPanelSection
        userLogin={userLogin}
        setUserLogin={setUserLogin}
        daftarAkun={daftarAkun}
        setDaftarAkun={setDaftarAkun}
        daftarJenjang={daftarJenjang}
        setDaftarJenjang={setDaftarJenjang}
        daftarBeasiswa={daftarBeasiswa}
        setDaftarBeasiswa={setDaftarBeasiswa}
        logAktivitas={logAktivitas}
        onBukaModeGuru={() => setAdminModeGuru(true)}
        onDownloadRekapCsv={handleDownloadRekapCsvExcel}
      />
    );
  }

  // 3. PORTAL SISWA
  if (userLogin.role === "siswa") {
    return (
      <SiswaPortalSection
        userLogin={userLogin}
        setUserLogin={setUserLogin}
        daftarAkun={daftarAkun}
        setDaftarAkun={setDaftarAkun}
        poinXP={poinXP}
        materiSelesai={materiSelesai}
        tambahXP={tambahXP}
        studyRooms={studyRooms}
        daftarTugas={daftarTugas}
        daftarPengumpulan={daftarPengumpulan}
        setDaftarPengumpulan={setDaftarPengumpulan}
        daftarBeasiswa={daftarBeasiswa}
        setDaftarBeasiswa={setDaftarBeasiswa}
      />
    );
  }

  // 4. STUDIO PENGAJAR / GURU
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div>
          <span className="bg-white/20 text-xs font-black px-3.5 py-1 rounded-full uppercase">
            {userLogin.role === "admin"
              ? "MODE GURU (DIAKSES OLEH SUPER ADMIN)"
              : "STUDIO PENGAJAR & KONTRIBUTOR ILMU"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">{userLogin.nama}</h1>
          <p className="text-indigo-200 text-sm">Penanggung Jawab Materi: {userLogin.email}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadRekapCsvExcel}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" /> Ekspor Rekap Nilai (.CSV / Excel)
          </button>
          {userLogin.role === "admin" && (
            <button
              onClick={() => setAdminModeGuru(false)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl shadow-lg cursor-pointer"
            >
              ← Panel Super Admin
            </button>
          )}
          <button
            onClick={() => setUserLogin(null)}
            className="bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: "materi", label: "1. Hibahkan Modul, Bab & Tugas", icon: <BookOpen className="w-4 h-4" /> },
          { id: "rantai_modul", label: `2. Kelola Rantai Prasyarat & KKM (${semuaModulFlat.length})`, icon: <GitBranch className="w-4 h-4" /> },
          { id: "tryout_qr", label: "3. Buat Tryout CBT & QR", icon: <Timer className="w-4 h-4" /> },
          { id: "tugas_rubrik", label: "4. Tugas, Nilai & Absensi", icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: "analitik", label: "5. Analitik Keaktifan Siswa", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "bank_soal", label: `6. Bank Soal Kolektif (${bankSoalKolektif.length})`, icon: <Database className="w-4 h-4" /> },
          { id: "rombel_live", label: `7. Rombel & Jadwal Live (${daftarKelompok.length})`, icon: <Users className="w-4 h-4" /> },
          { id: "rpp_repo", label: `8. Bank RPP (${rppList.length})`, icon: <FolderArchive className="w-4 h-4" /> },
          { id: "cv", label: "9. Profil & CV", icon: <Briefcase className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setGuruTabAktif(
                tab.id as
                  | "materi"
                  | "rantai_modul"
                  | "tryout_qr"
                  | "tugas_rubrik"
                  | "analitik"
                  | "bank_soal"
                  | "rombel_live"
                  | "rpp_repo"
                  | "cv"
              )
            }
            className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              guruTabAktif === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-slate-700 border border-slate-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {guruTabAktif === "cv" && (
        <ProfilCVSection
          userLogin={userLogin}
          setUserLogin={(u) => setUserLogin(u)}
          daftarAkun={daftarAkun}
          setDaftarAkun={setDaftarAkun}
        />
      )}

      {guruTabAktif === "tryout_qr" && (
        <GuruTryoutQrSection
          userLogin={userLogin}
          daftarPaketTryout={daftarPaketTryout}
          setDaftarPaketTryout={setDaftarPaketTryout}
          daftarPresensi={daftarPresensi}
          setDaftarPresensi={setDaftarPresensi}
          soalTryoutDraft={soalTryoutDraft}
        />
      )}

      {(guruTabAktif === "tugas_rubrik" ||
        guruTabAktif === "analitik" ||
        guruTabAktif === "bank_soal" ||
        guruTabAktif === "rombel_live" ||
        guruTabAktif === "rpp_repo") && (
        <GuruLainnyaSection
          tabAktif={guruTabAktif}
          userLogin={userLogin}
          daftarTugas={daftarTugas}
          daftarPengumpulan={daftarPengumpulan}
          setDaftarPengumpulan={setDaftarPengumpulan}
          daftarPresensi={daftarPresensi}
          rppList={rppList}
          setRppList={setRppList}
          bankSoalKolektif={bankSoalKolektif}
          setBankSoalKolektif={setBankSoalKolektif}
          soalTryoutDraft={soalTryoutDraft}
          setSoalTryoutDraft={setSoalTryoutDraft}
          daftarKelompok={daftarKelompok}
          setDaftarKelompok={setDaftarKelompok}
          jadwalLive={jadwalLive}
          setJadwalLive={setJadwalLive}
          kirimNotifikasiKeUser={kirimNotifikasiKeUser}
        />
      )}

      {guruTabAktif === "rantai_modul" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <div>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
              Prerequisite Chain &amp; Passing Grade Manager
            </span>
            <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-indigo-600" /> Kelola Rantai Urutan Modul &amp;
              Batas Nilai Kelulusan (KKM)
            </h2>
          </div>

          <div className="space-y-4">
            {semuaModulFlat.map((mdl, idx) => (
              <div
                key={mdl.id}
                className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-sm"
              >
                <div className="lg:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-xs font-black">
                      Modul #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">{mdl.namaJenjang}</span>
                  </div>
                  <div className="font-black text-base text-slate-900">{mdl.judul}</div>
                </div>

                <div className="lg:col-span-4">
                  <label className="text-xs font-black text-slate-600 block mb-1">
                    Syarat Modul Sebelumnya (Prerequisite):
                  </label>
                  <select
                    value={mdl.prasyaratKelasId || ""}
                    onChange={(e) => {
                      const val = e.target.value || undefined;
                      setDaftarJenjang((prev) =>
                        prev.map((j) => ({
                          ...j,
                          kelas: j.kelas.map((k) =>
                            k.id === mdl.id ? { ...k, prasyaratKelasId: val } : k
                          ),
                        }))
                      );
                    }}
                    className="w-full p-2.5 border rounded-xl bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="">-- Terbuka Langsung (Tanpa Prasyarat) --</option>
                    {semuaModulFlat
                      .filter((x) => x.id !== mdl.id)
                      .map((opsiMdl) => (
                        <option key={opsiMdl.id} value={opsiMdl.id}>
                          Wajib Lulus: {opsiMdl.judul}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="text-xs font-black text-slate-600 block mb-1">
                    Minimal Nilai Kuis (0 - 100):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={mdl.syaratSkorMinimal ?? 75}
                      onChange={(e) => {
                        const nilaiBaru = Number(e.target.value);
                        setDaftarJenjang((prev) =>
                          prev.map((j) => ({
                            ...j,
                            kelas: j.kelas.map((k) =>
                              k.id === mdl.id ? { ...k, syaratSkorMinimal: nilaiBaru } : k
                            ),
                          }))
                        );
                      }}
                      className="w-24 p-2.5 border-2 border-indigo-300 rounded-xl bg-white font-black text-center text-indigo-950"
                    />
                    <span className="text-xs font-bold text-emerald-700">✓ Tersimpan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: HIBAHKAN MATERI BARU + BAB POP-UP + JADWAL TUGAS & SESI KUIS */}
      {guruTabAktif === "materi" && (
        <div className="bg-white text-slate-800 p-8 rounded-[2rem] border border-slate-200 max-w-5xl space-y-6 shadow-xs">
          <h2 className="text-2xl font-black">
            Hibahkan Modul Baru (Bab Coursera/NetAcad + Jadwal Tugas &amp; Sesi Kuis)
          </h2>
          {notifGuru && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl font-black">
              ✓ Modul berurutan beserta jadwal tugas dan sesi kuis berhasil diterbitkan!
            </div>
          )}

          {bukaModalImportCsvKuis && (
            <div className="p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl space-y-3 text-xs">
              <div className="font-black text-sm text-indigo-950">
                Import Soal Kuis Massal via Format CSV (Titik Koma `;`)
              </div>
              <textarea
                rows={3}
                value={teksCsvKuis}
                onChange={(e) => setTeksCsvKuis(e.target.value)}
                className="w-full p-3 font-mono bg-white border rounded-xl"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const baris = teksCsvKuis.trim().split("\n").slice(1);
                    const hasil: KuisItem[] = baris
                      .map((b, i) => {
                        const kol = b.split(";");
                        return {
                          id: "csv-k-" + Date.now() + "-" + i,
                          tipe: (kol[0] as TipeSoal) || "pilihan_ganda",
                          tanya: kol[1] || "Soal Impor CSV",
                          opsi: (kol[2] || "A|B|C|D").split("|"),
                          jawabanBenar: Number(kol[3] || 0),
                          pembahasan: kol[6] || "Pembahasan CSV",
                          poin: Number(kol[7] || 50),
                        };
                      })
                      .filter((x) => x.tanya);
                    setDaftarKuisDraft([...daftarKuisDraft, ...hasil]);
                    setBukaModalImportCsvKuis(false);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black"
                >
                  Proses Import CSV
                </button>
                <button
                  type="button"
                  onClick={() => setBukaModalImportCsvKuis(false)}
                  className="bg-white border px-4 py-2 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!subJenjangPilih) return;
              const idModulBaru = "mdl-" + Date.now();
              const tugasLengkapModul: TugasItem[] = daftarTugasModulDraft
                .filter((t) => t.judul.trim() !== "")
                .map((t, idx) => ({
                  id: "tgs-m-" + Date.now() + "-" + idx,
                  subJenjangId: subJenjangPilih,
                  modulId: idModulBaru,
                  judul: t.judul,
                  jenisTugas: t.jenisTugas,
                  instruksi: t.instruksi,
                  waktuBuka: t.waktuBuka,
                  waktuTutup: t.waktuTutup,
                  deadline: `${t.waktuBuka.replace("T", " ")} s/d ${t.waktuTutup.replace("T", " ")}`,
                  pembuatNama: userLogin.nama,
                }));

              const modulBaru: KelasItem = {
                id: idModulBaru,
                subJenjangId: subJenjangPilih,
                judul: judulMateri,
                pembuatId: userLogin.id,
                pembuatNama: userLogin.nama,
                pembuatEmail: userLogin.email,
                tanggalUpload: "Hari ini",
                level: levelMateri,
                prasyaratKelasId: prasyaratKelasPilih || undefined,
                syaratSkorMinimal: syaratSkorMinimalInput || 75,
                jadwalBukaKuis: jadwalBukaKuisInput,
                jadwalTutupKuis: jadwalTutupKuisInput,
                kuisBolehMundur: kuisBolehMundurInput,
                kuisPakaiCoratCoret: kuisPakaiCoratCoretInput,
                daftarBab: daftarBabDraft,
                daftarTugasModul: tugasLengkapModul,
                durasi: "25 Menit",
                videoUrl: videoMateri.includes("watch?v=")
                  ? videoMateri.replace("watch?v=", "embed/")
                  : videoMateri,
                lampiranUrl: lampiranMateri || undefined,
                rangkuman: rangkumanMateri,
                daftarKuis: daftarKuisDraft,
              };

              if (tugasLengkapModul.length > 0) {
                setDaftarTugas([...tugasLengkapModul, ...daftarTugas]);
              }

              setDaftarJenjang((prev) =>
                prev.map((j) =>
                  j.subJenjang.some((sj) => sj.id === subJenjangPilih)
                    ? { ...j, kelas: [modulBaru, ...j.kelas] }
                    : j
                )
              );
              setNotifGuru(true);
              setJudulMateri("");
              setTimeout(() => setNotifGuru(false), 3000);
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                required
                value={subJenjangPilih}
                onChange={(e) => setSubJenjangPilih(e.target.value)}
                className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl font-extrabold text-sm text-indigo-950"
              >
                <option value="" disabled>
                  -- Pilih Tingkat Kelas Tujuan --
                </option>
                {semuaSubJenjangFlat.map((sj) => (
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
                placeholder="Judul Modul..."
                className="p-4 border border-slate-300 rounded-xl bg-white text-sm font-bold"
              />
              <select
                value={levelMateri}
                onChange={(e) =>
                  setLevelMateri(e.target.value as "Pemula" | "Menengah" | "Mahir")
                }
                className="p-4 border border-slate-300 rounded-xl bg-white text-sm font-bold"
              >
                <option value="Pemula">Level: Pemula (Dasar)</option>
                <option value="Menengah">Level: Menengah (Intermediate)</option>
                <option value="Mahir">Level: Mahir (Advanced)</option>
              </select>
            </div>

            {/* RANTAI PRASYARAT & NILAI KKM */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-3">
              <div className="font-black text-sm text-indigo-950 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" /> Pengaturan Rantai Modul
                Bersyarat (Prerequisite &amp; Nilai Kelulusan Minimal)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pilih Modul Prasyarat (Harus Lulus Modul Ini Dulu):
                  </label>
                  <select
                    value={prasyaratKelasPilih}
                    onChange={(e) => setPrasyaratKelasPilih(e.target.value)}
                    className="w-full p-3 border border-indigo-200 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value="">-- Tanpa Prasyarat (Langsung Terbuka) --</option>
                    {semuaModulFlat.map((kls) => (
                      <option key={kls.id} value={kls.id}>
                        Wajib Lulus: {kls.judul} ({kls.namaJenjang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Batas Nilai Kuis Minimal untuk Lulus (Passing Grade 0 - 100):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={syaratSkorMinimalInput}
                    onChange={(e) => setSyaratSkorMinimalInput(Number(e.target.value))}
                    className="w-full p-3 border border-indigo-200 rounded-xl bg-white font-black text-indigo-900"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="url"
                required
                value={videoMateri}
                onChange={(e) => setVideoMateri(e.target.value)}
                placeholder="URL Video YouTube Utama (https://...)"
                className="w-full p-4 border border-slate-300 rounded-xl bg-white text-sm"
              />
              <input
                type="url"
                value={lampiranMateri}
                onChange={(e) => setLampiranMateri(e.target.value)}
                placeholder="Link Lampiran Modul PDF/PPT (Opsional)"
                className="w-full p-4 border border-slate-300 rounded-xl bg-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                Rangkuman Pengantar Modul:
              </label>
              <RichTextEditorPro value={rangkumanMateri} onChange={setRangkumanMateri} />
            </div>

            {/* EDITOR DAFTAR BAB BERURUTAN */}
            <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="font-black text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" /> Daftar Bab Modul Pop-up (Mode
                  Coursera / Cisco NetAcad)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDaftarBabDraft([
                      ...daftarBabDraft,
                      {
                        id: "bab-draft-" + Date.now(),
                        judulBab: `Bab ${daftarBabDraft.length + 1}: Topik Pembahasan Baru`,
                        durasiBab: "10 Menit",
                        videoUrl: "",
                        kontenHtml: "<p>Isi pembahasan bab...</p>",
                      },
                    ])
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  + Tambah Bab Baru
                </button>
              </div>

              <div className="space-y-4">
                {daftarBabDraft.map((bab, bIdx) => (
                  <div
                    key={bab.id}
                    className="p-4 bg-white rounded-xl border border-slate-300 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-indigo-900">Bab #{bIdx + 1}</span>
                      {daftarBabDraft.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setDaftarBabDraft(daftarBabDraft.filter((_, i) => i !== bIdx))
                          }
                          className="text-rose-600 font-black"
                        >
                          Hapus Bab
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={bab.judulBab}
                        onChange={(e) =>
                          setDaftarBabDraft(
                            daftarBabDraft.map((item, i) =>
                              i === bIdx ? { ...item, judulBab: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Judul Bab..."
                        className="sm:col-span-2 p-2.5 border rounded-lg font-bold"
                      />
                      <input
                        type="text"
                        value={bab.durasiBab}
                        onChange={(e) =>
                          setDaftarBabDraft(
                            daftarBabDraft.map((item, i) =>
                              i === bIdx ? { ...item, durasiBab: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Durasi (Misal: 15 Menit)"
                        className="p-2.5 border rounded-lg"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={bab.kontenHtml}
                      onChange={(e) =>
                        setDaftarBabDraft(
                          daftarBabDraft.map((item, i) =>
                            i === bIdx ? { ...item, kontenHtml: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Isi materi bab..."
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FORM TUGAS KELAS + JENIS TUGAS + WAKTU BUKA & TUTUP PENGUMPULAN */}
            <div className="p-6 bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span className="font-black text-base text-emerald-950 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-emerald-600" /> Jenis Tugas &amp; Waktu
                    Buka-Tutup Pengumpulan Tugas ({daftarTugasModulDraft.length} Tugas)
                  </span>
                  <p className="text-xs text-slate-600">
                    Tentukan jenis tugas serta kapan sesi pengumpulan tugas dibuka dan ditutup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDaftarTugasModulDraft([
                      ...daftarTugasModulDraft,
                      {
                        id: "tgs-draft-" + Date.now(),
                        judul: "",
                        jenisTugas: "Esai Analisis",
                        instruksi: "",
                        waktuBuka: "2026-10-20T08:00",
                        waktuTutup: "2026-12-31T23:59",
                      },
                    ])
                  }
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black cursor-pointer"
                >
                  + Tambah Tugas Modul
                </button>
              </div>

              <div className="space-y-3">
                {daftarTugasModulDraft.map((tgs, tIdx) => (
                  <div
                    key={tgs.id}
                    className="p-4 bg-white rounded-xl border border-emerald-200 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-emerald-900">
                        Tugas Modul #{tIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDaftarTugasModulDraft(
                            daftarTugasModulDraft.filter((_, i) => i !== tIdx)
                          )
                        }
                        className="text-rose-600 font-black"
                      >
                        Hapus Tugas
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={tgs.judul}
                        onChange={(e) =>
                          setDaftarTugasModulDraft(
                            daftarTugasModulDraft.map((item, i) =>
                              i === tIdx ? { ...item, judul: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Judul Tugas / Proyek Mandiri..."
                        className="sm:col-span-2 p-2.5 border rounded-lg font-bold"
                      />
                      <select
                        value={tgs.jenisTugas}
                        onChange={(e) =>
                          setDaftarTugasModulDraft(
                            daftarTugasModulDraft.map((item, i) =>
                              i === tIdx
                                ? { ...item, jenisTugas: e.target.value as JenisTugasTipe }
                                : item
                            )
                          )
                        }
                        className="p-2.5 border rounded-lg bg-emerald-50 font-black text-emerald-950"
                      >
                        <option value="Esai Analisis">Jenis: Esai Analisis</option>
                        <option value="Proyek Coding / IT">Jenis: Proyek Coding / IT</option>
                        <option value="Laporan Praktikum">Jenis: Laporan Praktikum</option>
                        <option value="Presentasi / Video">Jenis: Presentasi / Video</option>
                        <option value="Resume Jurnal">Jenis: Resume Jurnal</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border">
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">
                          Waktu Buka Pengumpulan Tugas:
                        </label>
                        <input
                          type="datetime-local"
                          value={tgs.waktuBuka}
                          onChange={(e) =>
                            setDaftarTugasModulDraft(
                              daftarTugasModulDraft.map((item, i) =>
                                i === tIdx ? { ...item, waktuBuka: e.target.value } : item
                              )
                            )
                          }
                          className="w-full p-2 border rounded-lg bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">
                          Waktu Tutup (Deadline) Pengumpulan:
                        </label>
                        <input
                          type="datetime-local"
                          value={tgs.waktuTutup}
                          onChange={(e) =>
                            setDaftarTugasModulDraft(
                              daftarTugasModulDraft.map((item, i) =>
                                i === tIdx ? { ...item, waktuTutup: e.target.value } : item
                              )
                            )
                          }
                          className="w-full p-2 border rounded-lg bg-white font-bold"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={tgs.instruksi}
                      onChange={(e) =>
                        setDaftarTugasModulDraft(
                          daftarTugasModulDraft.map((item, i) =>
                            i === tIdx ? { ...item, instruksi: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Tuliskan instruksi lengkap pengerjaan tugas dan kriteria penilaian..."
                      className="w-full p-2.5 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* EDITOR DAFTAR KUIS + JADWAL BUKA/TUTUP SESI KUIS MODUL */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="font-black text-base">
                    Daftar Kuis Evaluasi Modul &amp; Jadwal Sesi Kuis ({daftarKuisDraft.length}{" "}
                    Soal)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAiGenerateQuiz}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Wand2 className="w-4 h-4" /> ⚡ AI Generate 4 Soal dari Rangkuman
                  </button>
                  <button
                    type="button"
                    onClick={() => setBukaModalImportCsvKuis(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Import CSV Soal
                  </button>
                </div>
              </div>

              {/* Pengaturan Waktu Buka-Tutup Sesi Kuis & Kertas Corat-Coret */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-black text-amber-950 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Sesi Kuis Dibuka:
                  </label>
                  <input
                    type="datetime-local"
                    value={jadwalBukaKuisInput}
                    onChange={(e) => setJadwalBukaKuisInput(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-black text-amber-950 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Sesi Kuis Ditutup:
                  </label>
                  <input
                    type="datetime-local"
                    value={jadwalTutupKuisInput}
                    onChange={(e) => setJadwalTutupKuisInput(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white font-bold"
                  />
                </div>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kuisPakaiCoratCoretInput}
                    onChange={(e) => setKuisPakaiCoratCoretInput(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span>✏️ Aktifkan Corat-Coret Kuis</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kuisBolehMundurInput}
                    onChange={(e) => setKuisBolehMundurInput(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span>↩️ Boleh Mundur Soal</span>
                </label>
              </div>

              <div className="space-y-5">
                {daftarKuisDraft.map((kuis, kIdx) => (
                  <div
                    key={kuis.id}
                    className="p-5 border-2 border-slate-200 rounded-2xl bg-slate-50/70 space-y-4 text-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-xs bg-slate-900 text-white px-2.5 py-1 rounded-md">
                          Soal #{kIdx + 1}
                        </span>
                        <select
                          value={kuis.tipe}
                          onChange={(e) => {
                            const tipeBaru = e.target.value as TipeSoal;
                            setDaftarKuisDraft(
                              daftarKuisDraft.map((item, idx) =>
                                idx === kIdx
                                  ? {
                                      ...item,
                                      tipe: tipeBaru,
                                      opsi:
                                        tipeBaru === "benar_salah"
                                          ? ["Benar", "Salah"]
                                          : ["", "", "", ""],
                                      jawabanBenar: 0,
                                      jawabanJamak:
                                        tipeBaru === "pilihan_jamak" ? [0, 1] : undefined,
                                      pasangan:
                                        tipeBaru === "mencocokkan"
                                          ? [
                                              { kiri: "Rumus Gaya", kanan: "F = m . a" },
                                              { kiri: "Satuan Gaya", kanan: "Newton (N)" },
                                            ]
                                          : undefined,
                                    }
                                  : item
                              )
                            );
                          }}
                          className="px-3 py-1.5 border border-indigo-200 rounded-lg bg-white text-xs font-black text-indigo-950"
                        >
                          <option value="pilihan_ganda">1. Pilihan Ganda (1 Kunci Benar)</option>
                          <option value="pilihan_jamak">
                            2. Pilihan Jamak (Banyak Kunci Benar)
                          </option>
                          <option value="benar_salah">3. Benar / Salah</option>
                          <option value="isian_singkat">4. Isian Singkat (Teks Kunci)</option>
                          <option value="mencocokkan">
                            5. Mencocokkan Pasangan (Kiri ↔ Kanan)
                          </option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setDaftarKuisDraft(daftarKuisDraft.filter((_, idx) => idx !== kIdx))
                        }
                        className="text-xs font-black text-rose-600 hover:underline"
                      >
                        Hapus Soal
                      </button>
                    </div>

                    <input
                      type="text"
                      value={kuis.tanya}
                      onChange={(e) =>
                        setDaftarKuisDraft(
                          daftarKuisDraft.map((item, idx) =>
                            idx === kIdx ? { ...item, tanya: e.target.value } : item
                          )
                        )
                      }
                      placeholder="Ketik kalimat pertanyaan soal di sini..."
                      className="w-full p-3.5 border border-slate-300 rounded-xl bg-white font-bold"
                    />

                    {kuis.tipe === "pilihan_ganda" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {kuis.opsi.map((op, oIdx) => {
                          const adalahKunci = kuis.jawabanBenar === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center gap-2 p-2 rounded-xl border-2 bg-white ${
                                adalahKunci
                                  ? "border-emerald-500 bg-emerald-50/40"
                                  : "border-slate-200"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setDaftarKuisDraft(
                                    daftarKuisDraft.map((item, idx) =>
                                      idx === kIdx ? { ...item, jawabanBenar: oIdx } : item
                                    )
                                  )
                                }
                                className={`px-2.5 py-2 rounded-lg text-[11px] font-black shrink-0 cursor-pointer ${
                                  adalahKunci
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {adalahKunci
                                  ? "✓ Kunci Benar"
                                  : `Pilih ${String.fromCharCode(65 + oIdx)}`}
                              </button>
                              <input
                                type="text"
                                value={op}
                                onChange={(e) => {
                                  const opsiBaru = [...kuis.opsi];
                                  opsiBaru[oIdx] = e.target.value;
                                  setDaftarKuisDraft(
                                    daftarKuisDraft.map((item, idx) =>
                                      idx === kIdx ? { ...item, opsi: opsiBaru } : item
                                    )
                                  );
                                }}
                                placeholder={`Teks Opsi ${String.fromCharCode(65 + oIdx)}...`}
                                className="w-full p-1.5 text-xs font-semibold bg-transparent focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {kuis.tipe === "pilihan_jamak" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {kuis.opsi.map((op, oIdx) => {
                          const jamakSaatIni = kuis.jawabanJamak || [0, 1];
                          const dicentangKunci = jamakSaatIni.includes(oIdx);
                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 bg-white ${
                                dicentangKunci
                                  ? "border-indigo-500 bg-indigo-50/40"
                                  : "border-slate-200"
                              }`}
                            >
                              <label className="flex items-center gap-1.5 text-[11px] font-black text-indigo-900 shrink-0 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dicentangKunci}
                                  onChange={() => {
                                    const baru = dicentangKunci
                                      ? jamakSaatIni.filter((x) => x !== oIdx)
                                      : [...jamakSaatIni, oIdx];
                                    setDaftarKuisDraft(
                                      daftarKuisDraft.map((item, idx) =>
                                        idx === kIdx ? { ...item, jawabanJamak: baru } : item
                                      )
                                    );
                                  }}
                                  className="w-4 h-4 accent-indigo-600"
                                />
                                <span>Kunci</span>
                              </label>
                              <input
                                type="text"
                                value={op}
                                onChange={(e) => {
                                  const opsiBaru = [...kuis.opsi];
                                  opsiBaru[oIdx] = e.target.value;
                                  setDaftarKuisDraft(
                                    daftarKuisDraft.map((item, idx) =>
                                      idx === kIdx ? { ...item, opsi: opsiBaru } : item
                                    )
                                  );
                                }}
                                placeholder={`Pernyataan ${oIdx + 1}...`}
                                className="w-full p-1 text-xs font-semibold bg-transparent focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {kuis.tipe === "benar_salah" && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-700">
                          Tentukan Kunci Pernyataan Ini:
                        </span>
                        {["Benar", "Salah"].map((labelBS, bsIdx) => (
                          <button
                            key={labelBS}
                            type="button"
                            onClick={() =>
                              setDaftarKuisDraft(
                                daftarKuisDraft.map((item, idx) =>
                                  idx === kIdx
                                    ? { ...item, opsi: ["Benar", "Salah"], jawabanBenar: bsIdx }
                                    : item
                                )
                              )
                            }
                            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                              kuis.jawabanBenar === bsIdx
                                ? "bg-emerald-600 text-white"
                                : "bg-white border text-slate-700"
                            }`}
                          >
                            {kuis.jawabanBenar === bsIdx ? `✓ Kunci: ${labelBS}` : labelBS}
                          </button>
                        ))}
                      </div>
                    )}

                    {kuis.tipe === "isian_singkat" && (
                      <input
                        type="text"
                        value={kuis.jawabanTeks || ""}
                        onChange={(e) =>
                          setDaftarKuisDraft(
                            daftarKuisDraft.map((item, idx) =>
                              idx === kIdx ? { ...item, jawabanTeks: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Ketik kata kunci jawaban yang benar..."
                        className="w-full p-3 border-2 border-emerald-400 rounded-xl bg-emerald-50/40 text-xs font-bold"
                      />
                    )}

                    {kuis.tipe === "mencocokkan" && (
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-indigo-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-indigo-900">
                            Pasangan Kiri (Pertanyaan) ↔ Kanan (Jawaban Benar):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const listPasangan = kuis.pasangan || [];
                              setDaftarKuisDraft(
                                daftarKuisDraft.map((item, idx) =>
                                  idx === kIdx
                                    ? {
                                        ...item,
                                        pasangan: [...listPasangan, { kiri: "", kanan: "" }],
                                      }
                                    : item
                                )
                              );
                            }}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-black"
                          >
                            + Tambah Baris Pasangan
                          </button>
                        </div>

                        {(kuis.pasangan || []).map((pas, pIdx) => (
                          <div
                            key={pIdx}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            <input
                              type="text"
                              value={pas.kiri}
                              onChange={(e) => {
                                const pasBaru = [...(kuis.pasangan || [])];
                                pasBaru[pIdx] = { ...pasBaru[pIdx], kiri: e.target.value };
                                setDaftarKuisDraft(
                                  daftarKuisDraft.map((item, idx) =>
                                    idx === kIdx ? { ...item, pasangan: pasBaru } : item
                                  )
                                );
                              }}
                              placeholder={`Item Kiri #${pIdx + 1}`}
                              className="sm:col-span-5 p-2.5 border rounded-lg text-xs font-bold bg-slate-50"
                            />
                            <span className="sm:col-span-1 text-center font-black text-emerald-600">
                              ↔
                            </span>
                            <input
                              type="text"
                              value={pas.kanan}
                              onChange={(e) => {
                                const pasBaru = [...(kuis.pasangan || [])];
                                pasBaru[pIdx] = { ...pasBaru[pIdx], kanan: e.target.value };
                                setDaftarKuisDraft(
                                  daftarKuisDraft.map((item, idx) =>
                                    idx === kIdx ? { ...item, pasangan: pasBaru } : item
                                  )
                                );
                              }}
                              placeholder={`Pasangan Benar #${pIdx + 1}`}
                              className="sm:col-span-5 p-2.5 border border-emerald-300 rounded-lg text-xs font-bold bg-emerald-50/40"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const pasBaru = (kuis.pasangan || []).filter(
                                  (_, i) => i !== pIdx
                                );
                                setDaftarKuisDraft(
                                  daftarKuisDraft.map((item, idx) =>
                                    idx === kIdx ? { ...item, pasangan: pasBaru } : item
                                  )
                                );
                              }}
                              className="sm:col-span-1 text-xs font-black text-rose-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                      <input
                        type="text"
                        value={kuis.pembahasan}
                        onChange={(e) =>
                          setDaftarKuisDraft(
                            daftarKuisDraft.map((item, idx) =>
                              idx === kIdx ? { ...item, pembahasan: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Tulis pembahasan kunci jawaban..."
                        className="sm:col-span-9 p-2.5 border rounded-xl bg-white text-xs"
                      />
                      <div className="sm:col-span-3 flex items-center gap-1.5 bg-white border rounded-xl px-3 py-2">
                        <span className="text-xs font-bold text-slate-500">Poin XP:</span>
                        <input
                          type="number"
                          value={kuis.poin}
                          onChange={(e) =>
                            setDaftarKuisDraft(
                              daftarKuisDraft.map((item, idx) =>
                                idx === kIdx
                                  ? { ...item, poin: Number(e.target.value) || 50 }
                                  : item
                              )
                            )
                          }
                          className="w-full font-black text-xs text-amber-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setDaftarKuisDraft([
                    ...daftarKuisDraft,
                    {
                      id: "draft-" + Date.now(),
                      tipe: "pilihan_ganda",
                      tanya: "",
                      opsi: ["", "", "", ""],
                      jawabanBenar: 0,
                      pembahasan: "Pembahasan soal",
                      poin: 50,
                    },
                  ])
                }
                className="px-4 py-2.5 border-2 border-slate-300 rounded-xl text-xs font-black hover:bg-slate-50 cursor-pointer"
              >
                + Tambah Soal Manual
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-base shadow-lg cursor-pointer transition"
            >
              Terbitkan Modul, Bab, Jadwal Tugas &amp; Sesi Kuis Sekarang
            </button>
          </form>
        </div>
      )}
    </div>
  );
};