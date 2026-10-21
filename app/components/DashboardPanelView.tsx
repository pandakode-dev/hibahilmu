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
  Sparkles,
  Download,
  LogOut,
  Wand2,
  Clock,
  FolderArchive,
  QrCode,
  Coins,
  Target,
  Award,
  Globe,
  Share2,
  Printer,
  PlusCircle,
  Upload,
  UserPlus,
  Edit3,
  Trash2,
  Users,
  Timer,
} from "lucide-react";
import {
  AkunPengguna,
  JenjangItem,
  KuisItem,
  TipeSoal,
  PaketTryout,
  SoalTryout,
  TugasItem,
  PengumpulanTugas,
  PresensiItem,
  RppItem,
  KelompokBelajar,
  JadwalLiveItem,
  StudyRoomItem,
  PengajuanBeasiswaItem,
  LogAktivitas,
  BiodataCV,
  KategoriTes,
  KelasItem,
  RiwayatPercobaanTryout,
} from "../types";
import {
  bersihkanTagHtml,
  analisisRubrikEsaiAI,
  TEMPLATE_CSV_AKUN,
  TEMPLATE_CSV_KUIS,
} from "../mockData";
import { RichTextEditorPro } from "./RichTextEditorPro";

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
  daftarPengumpulan,
  setDaftarPengumpulan,
  daftarPresensi,
  setDaftarPresensi,
  rppList,
  setRppList,
  bankSoalKolektif,
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

  const [adminTabAktif, setAdminTabAktif] = useState<
    "akun" | "beasiswa" | "kategori" | "cv" | "log"
  >("akun");

  // State Modal Edit & Tambah User oleh Super Admin
  const [akunDieditAdmin, setAkunDieditAdmin] = useState<AkunPengguna | null>(null);
  const [bukaModalTambahAkun, setBukaModalTambahAkun] = useState(false);
  const [bukaModalImportCsvAkun, setBukaModalImportCsvAkun] = useState(false);
  const [teksCsvAkun, setTeksCsvAkun] = useState(TEMPLATE_CSV_AKUN);

  // State Tambah Kategori/Sub-Jenjang oleh Admin
  const [jenjangIndukKategoriBaru, setJenjangIndukKategoriBaru] = useState("sma");
  const [namaSubJenjangBaru, setNamaSubJenjangBaru] = useState("");

  // Tab Studio Guru (Lengkap 8 Tab)
  const [guruTabAktif, setGuruTabAktif] = useState<
    | "materi"
    | "tryout_qr"
    | "tugas_rubrik"
    | "analitik"
    | "bank_soal"
    | "rombel_live"
    | "rpp_repo"
    | "cv"
  >("materi");

  const [siswaTabAktif, setSiswaTabAktif] = useState<
    | "showcase_publik"
    | "quests_study"
    | "tugas"
    | "rapor_sertifikat"
    | "beasiswa"
    | "cv"
  >("showcase_publik");

  // State Form Materi & 5 Jenis Soal Kuis
  const [subJenjangPilih, setSubJenjangPilih] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [levelMateri] = useState<"Pemula" | "Menengah" | "Mahir">("Pemula");
  const [videoMateri, setVideoMateri] = useState("");
  const [lampiranMateri, setLampiranMateri] = useState("");
  const [rangkumanMateri, setRangkumanMateri] = useState("");
  const [notifGuru, setNotifGuru] = useState(false);
  const [bukaModalImportCsvKuis, setBukaModalImportCsvKuis] = useState(false);
  const [teksCsvKuis, setTeksCsvKuis] = useState(TEMPLATE_CSV_KUIS);

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

  // State RPP
  const [judulRppBaru, setJudulRppBaru] = useState("");
  const [mapelRppBaru, setMapelRppBaru] = useState("");
  const [jenjangRppBaru] = useState("Kelas 11 MIPA");
  const [kurikulumRppBaru, setKurikulumRppBaru] = useState<
    "Kurikulum Merdeka" | "K13 Revisi" | "Silabus Kampus / RPS"
  >("Kurikulum Merdeka");
  const [tujuanRppBaru, setTujuanRppBaru] = useState("");
  const [urlRppBaru, setUrlRppBaru] = useState("https://drive.google.com");

  // State Penilaian Guru
  const [inputNilaiGuru, setInputNilaiGuru] = useState<{ [subId: string]: number }>({});
  const [inputFeedbackGuru, setInputFeedbackGuru] = useState<{ [subId: string]: string }>({});

  // State Tryout & QR
  const [judulTryoutBaru, setJudulTryoutBaru] = useState("");
  const [kategoriTesBaru, setKategoriTesBaru] = useState<KategoriTes>("TPA");
  const [alamatTryoutBaru, setAlamatTryoutBaru] = useState(
    "Gedung CBT Center R.101 / Online Fullscreen"
  );
  const [soalTryoutDraft] = useState<SoalTryout[]>([
    {
      id: "td-1",
      pertanyaan: "Contoh Pertanyaan Tryout",
      opsi: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      jawabanBenar: 0,
      pembahasan: "Pembahasan soal",
    },
  ]);
  const [tokenQrInput, setTokenQrInput] = useState("");

  // State Rombel & Jadwal Live
  const [namaRombelBaru, setNamaRombelBaru] = useState("");
  const [pengumumanRombelBaru, setPengumumanRombelBaru] = useState("");
  const [judulLiveBaru, setJudulLiveBaru] = useState("");
  const [jadwalJamLiveBaru, setJadwalJamLiveBaru] = useState("");

  // State Siswa
  const [klaimQuestIds, setKlaimQuestIds] = useState<string[]>([]);
  const [jawabanTugasSiswaInput, setJawabanTugasSiswaInput] = useState<{
    [id: string]: string;
  }>({});
  const [judulKaryaBaru, setJudulKaryaBaru] = useState("");
  const [kategoriKaryaBaru, setKategoriKaryaBaru] = useState("Proyek Sains & IT");
  const [deskripsiKaryaBaru, setDeskripsiKaryaBaru] = useState("");
  const [linkKaryaBaru, setLinkKaryaBaru] = useState("https://github.com");
  const [alasanBeasiswaInput, setAlasanBeasiswaInput] = useState("");

  // State Form Biodata & CV Lengkap
  const [cvFoto, setCvFoto] = useState(userLogin?.cv?.fotoUrl || "");
  const [cvHeadline, setCvHeadline] = useState(
    userLogin?.cv?.headline || userLogin?.infoTambahan || ""
  );
  const [cvSekolah, setCvSekolah] = useState(userLogin?.cv?.asalSekolahKampus || "");
  const [cvPendidikan, setCvPendidikan] = useState(userLogin?.cv?.pendidikanTerakhir || "");
  const [cvBioSingkat, setCvBioSingkat] = useState(userLogin?.cv?.bioSingkat || "");
  const [cvSkillsTeks, setCvSkillsTeks] = useState(
    (userLogin?.cv?.skills || []).join(", ")
  );
  const [cvPengalamanTeks, setCvPengalamanTeks] = useState(
    (userLogin?.cv?.pengalaman || []).join("\n")
  );
  const [cvPrestasiTeks, setCvPrestasiTeks] = useState(
    (userLogin?.cv?.prestasi || []).join("\n")
  );
  const [cvPortfolioUrl, setCvPortfolioUrl] = useState(userLogin?.cv?.portfolioUrl || "");
  const [notifSimpanCV, setNotifSimpanCV] = useState(false);

  const semuaSubJenjangFlat = daftarJenjang.flatMap((j) =>
    j.subJenjang.map((sj) => ({ ...sj, namaInduk: j.nama }))
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

  // AI Quiz Generator 3 Soal Multi-Tipe Otomatis
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
        tipe: "isian_singkat",
        tanya: `[AI Generated] Sebutkan topik atau kata kunci utama dari modul pembelajaran ini!`,
        opsi: [],
        jawabanBenar: 0,
        jawabanTeks: topik.toLowerCase(),
        pembahasan: `Kata kunci utama modul ini adalah ${topik}.`,
        poin: 60,
      },
    ]);
    alert("⚡ AI Quiz Generator berhasil menyusun 3 soal multi-format dari rangkuman Anda!");
  };

  // ============================================================================
  // KOMPONEN PROFIL & CV 2 KOLOM PERSIS SCREENSHOT
  // ============================================================================
  const renderProfilDanCV = () => {
    if (!userLogin) return null;
    const daftarSkillPreview = cvSkillsTeks
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Kartu Preview Profil & CV Bergradasi Biru-Hijau Persis Screenshot */}
        <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500" />
          <div className="px-7 pb-7 -mt-12 space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-black text-slate-700">
              {cvFoto ? (
                <img src={cvFoto} alt={userLogin.nama} className="w-full h-full object-cover" />
              ) : (
                userLogin.nama.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">{userLogin.nama}</h3>
              <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
                {cvHeadline || userLogin.infoTambahan}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {cvBioSingkat || "Belum ada deskripsi biodata singkat."}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
              <div>
                <div className="font-black uppercase text-slate-400 text-[10px]">
                  ASAL SEKOLAH / KAMPUS
                </div>
                <div className="font-bold text-slate-800 mt-0.5">
                  {cvSekolah || "-"} ({cvPendidikan || "-"})
                </div>
              </div>

              <div>
                <div className="font-black uppercase text-slate-400 text-[10px] mb-1.5">
                  SKILLS &amp; KEMAMPUAN
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {daftarSkillPreview.length > 0 ? (
                    daftarSkillPreview.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px]"
                      >
                        {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Edit Foto Profil, Biodata & CV Lengkap */}
        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Edit Foto Profil, Biodata &amp; CV
          </h3>
          {notifSimpanCV && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-bold">
              ✓ Perubahan Biodata dan CV berhasil disimpan!
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const cvBaru: BiodataCV = {
                fotoUrl: cvFoto,
                headline: cvHeadline,
                bioSingkat: cvBioSingkat,
                asalSekolahKampus: cvSekolah,
                pendidikanTerakhir: cvPendidikan,
                skills: daftarSkillPreview,
                pengalaman: cvPengalamanTeks
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
                prestasi: cvPrestasiTeks
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
                portfolioUrl: cvPortfolioUrl,
                karyaPublik: userLogin.cv?.karyaPublik || [],
              };
              const updated = { ...userLogin, infoTambahan: cvHeadline, cv: cvBaru };
              setUserLogin(updated);
              setDaftarAkun(daftarAkun.map((a) => (a.id === userLogin.id ? updated : a)));
              setNotifSimpanCV(true);
              setTimeout(() => setNotifSimpanCV(false), 2500);
            }}
            className="space-y-4 text-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="url"
                value={cvFoto}
                onChange={(e) => setCvFoto(e.target.value)}
                placeholder="URL Foto Profil (https://...)"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
              />
              <input
                type="text"
                value={cvHeadline}
                onChange={(e) => setCvHeadline(e.target.value)}
                placeholder="Headline / Spesialisasi"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={cvSekolah}
                onChange={(e) => setCvSekolah(e.target.value)}
                placeholder="Asal Sekolah / Universitas"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
              />
              <input
                type="text"
                value={cvPendidikan}
                onChange={(e) => setCvPendidikan(e.target.value)}
                placeholder="Tingkat / Pendidikan Terakhir"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <textarea
              rows={3}
              value={cvBioSingkat}
              onChange={(e) => setCvBioSingkat(e.target.value)}
              placeholder="Biodata singkat..."
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
            />

            <input
              type="text"
              value={cvSkillsTeks}
              onChange={(e) => setCvSkillsTeks(e.target.value)}
              placeholder="Keahlian / Skills (Pisahkan dengan koma)"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white font-semibold"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <textarea
                rows={2}
                value={cvPengalamanTeks}
                onChange={(e) => setCvPengalamanTeks(e.target.value)}
                placeholder="Pengalaman Mengajar / Organisasi (Pisahkan per baris)"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-xs"
              />
              <textarea
                rows={2}
                value={cvPrestasiTeks}
                onChange={(e) => setCvPrestasiTeks(e.target.value)}
                placeholder="Prestasi & Penghargaan (Pisahkan per baris)"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-xs"
              />
            </div>

            <input
              type="url"
              value={cvPortfolioUrl}
              onChange={(e) => setCvPortfolioUrl(e.target.value)}
              placeholder="URL Portofolio / LinkedIn / GitHub (https://...)"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-md cursor-pointer transition"
            >
              Simpan Perubahan Biodata &amp; CV
            </button>
          </form>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 1. GERBANG LOGIN & REGISTRASI
  // ============================================================================
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
              RPP, tugas, dan sertifikat dapat dipertanggungjawabkan.
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
                  minatSubJenjang: ["sma-11-ipa"],
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

  // ============================================================================
  // 2. STUDIO GURU (LENGKAP 8 TAB + 5 JENIS SOAL KUIS + IMPORT CSV)
  // ============================================================================
  if (userLogin.role === "guru" || (userLogin.role === "admin" && adminModeGuru)) {
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

        {/* Navigasi Tab Studio Guru Persis Screenshot */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "materi", label: "1. Hibahkan Materi & AI Quiz", icon: <BookOpen className="w-4 h-4" /> },
            { id: "tryout_qr", label: "2. Buat Tryout CBT & QR", icon: <Timer className="w-4 h-4" /> },
            { id: "tugas_rubrik", label: "3. Tugas, Nilai & Absensi", icon: <ClipboardCheck className="w-4 h-4" /> },
            { id: "analitik", label: "4. Analitik Keaktifan Siswa", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "bank_soal", label: `5. Bank Soal Kolektif (${bankSoalKolektif.length})`, icon: <Database className="w-4 h-4" /> },
            { id: "rombel_live", label: `6. Rombel & Jadwal Live (${daftarKelompok.length})`, icon: <Users className="w-4 h-4" /> },
            { id: "rpp_repo", label: `7. Bank RPP (${rppList.length})`, icon: <FolderArchive className="w-4 h-4" /> },
            { id: "cv", label: "8. Profil & CV", icon: <Briefcase className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setGuruTabAktif(
                  tab.id as
                    | "materi"
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

        {guruTabAktif === "cv" && renderProfilDanCV()}

        {/* TAB 1: HIBAHKAN MATERI BARU + 5 JENIS SOAL KUIS LENGKAP PERSIS SCREENSHOT */}
        {guruTabAktif === "materi" && (
          <div className="bg-white text-slate-800 p-8 rounded-[2rem] border border-slate-200 max-w-5xl space-y-6 shadow-xs">
            <h2 className="text-2xl font-black">
              Hibahkan &amp; Publikasikan Materi Baru (Rich Text Editor Pro + AI Quiz Generator)
            </h2>
            {notifGuru && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl font-black">
                ✓ Materi terverifikasi berhasil diterbitkan ke ruang belajar!
              </div>
            )}

            {/* Modal Import CSV Soal Kuis */}
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
                const modulBaru: KelasItem = {
                  id: "mdl-" + Date.now(),
                  subJenjangId: subJenjangPilih,
                  judul: judulMateri,
                  pembuatId: userLogin.id,
                  pembuatNama: userLogin.nama,
                  pembuatEmail: userLogin.email,
                  tanggalUpload: "Hari ini",
                  level: levelMateri,
                  durasi: "20 Menit",
                  videoUrl: videoMateri.includes("watch?v=")
                    ? videoMateri.replace("watch?v=", "embed/")
                    : videoMateri,
                  lampiranUrl: lampiranMateri || undefined,
                  rangkuman: rangkumanMateri,
                  daftarKuis: daftarKuisDraft,
                };
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  required
                  value={subJenjangPilih}
                  onChange={(e) => setSubJenjangPilih(e.target.value)}
                  className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl font-extrabold text-sm text-indigo-950"
                >
                  <option value="" disabled>
                    -- Pilih Tingkat Kelas Tujuan --
                  </option>
                  {semuaSubJenjangFlat
                    .filter((sj) => {
                      if (userLogin.role === "admin") return true;
                      const akses = userLogin.aksesMengajar || [];
                      return akses.includes("ALL") || akses.includes(sj.id);
                    })
                    .map((sj) => (
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
                  placeholder="Judul Materi..."
                  className="p-4 border border-slate-300 rounded-xl bg-white text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="url"
                  required
                  value={videoMateri}
                  onChange={(e) => setVideoMateri(e.target.value)}
                  placeholder="URL Video YouTube (https://...)"
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

              <RichTextEditorPro value={rangkumanMateri} onChange={setRangkumanMateri} />

              {/* KOTAK PEMBUATAN KUIS MULTI-FORMAT PERSIS SCREENSHOT */}
              <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl space-y-5">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <span className="font-black text-base">
                    Daftar Kuis Materi ({daftarKuisDraft.length} Soal)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAiGenerateQuiz}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Wand2 className="w-4 h-4" /> ⚡ AI Generate 3 Soal dari Rangkuman
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

                <div className="space-y-4">
                  {daftarKuisDraft.map((kuis, kIdx) => (
                    <div
                      key={kuis.id}
                      className="p-5 border border-slate-300 rounded-2xl bg-slate-50/60 space-y-3 text-sm"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs">
                            Soal #{kIdx + 1} ({kuis.tipe})
                          </span>
                          {/* Pemilih 5 Jenis Soal */}
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
                                        pasangan:
                                          tipeBaru === "mencocokkan"
                                            ? [
                                                { kiri: "Konsep A", kanan: "Definisi A" },
                                                { kiri: "Konsep B", kanan: "Definisi B" },
                                              ]
                                            : undefined,
                                      }
                                    : item
                                )
                              );
                            }}
                            className="px-2.5 py-1 border rounded-lg bg-white text-xs font-bold text-indigo-900"
                          >
                            <option value="pilihan_ganda">1. Pilihan Ganda</option>
                            <option value="pilihan_jamak">2. Pilihan Jamak (Multi-Select)</option>
                            <option value="benar_salah">3. Benar / Salah</option>
                            <option value="isian_singkat">4. Isian Singkat (Fuzzy Grader)</option>
                            <option value="mencocokkan">5. Mencocokkan Pasangan</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setDaftarKuisDraft(daftarKuisDraft.filter((_, idx) => idx !== kIdx))
                          }
                          className="text-xs font-black text-rose-600 hover:underline"
                        >
                          Hapus
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
                        placeholder="Ketik pertanyaan..."
                        className="w-full p-3 border border-slate-300 rounded-xl bg-white"
                      />

                      {(kuis.tipe === "pilihan_ganda" || kuis.tipe === "pilihan_jamak") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {kuis.opsi.map((op, oIdx) => (
                            <input
                              key={oIdx}
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
                              placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                              className="p-3 border border-slate-300 rounded-xl bg-white text-xs"
                            />
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
                          placeholder="Kunci jawaban teks singkat..."
                          className="w-full p-3 border border-emerald-300 rounded-xl bg-emerald-50/40 text-xs font-bold"
                        />
                      )}
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
                  className="px-4 py-2 border-2 border-slate-300 rounded-xl text-xs font-black hover:bg-slate-50 cursor-pointer"
                >
                  + Tambah Soal Manual
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl text-base shadow-lg cursor-pointer transition"
              >
                Terbitkan Materi Terverifikasi Sekarang
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: ROMBEL & JADWAL LIVE */}
        {guruTabAktif === "rombel_live" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black">Manajemen Rombongan Belajar (Rombel)</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!namaRombelBaru.trim()) return;
                  setDaftarKelompok([
                    {
                      id: "klp-" + Date.now(),
                      namaKelas: namaRombelBaru,
                      pengumuman: pengumumanRombelBaru,
                      guruId: userLogin.id,
                      siswaIds: ["siswa-1"],
                    },
                    ...daftarKelompok,
                  ]);
                  setNamaRombelBaru("");
                  setPengumumanRombelBaru("");
                }}
                className="space-y-3 text-sm"
              >
                <input
                  type="text"
                  required
                  value={namaRombelBaru}
                  onChange={(e) => setNamaRombelBaru(e.target.value)}
                  placeholder="Nama Rombel / Kelas..."
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
                <input
                  type="text"
                  value={pengumumanRombelBaru}
                  onChange={(e) => setPengumumanRombelBaru(e.target.value)}
                  placeholder="Pengumuman Kelas..."
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black"
                >
                  + Buat Rombel Baru
                </button>
              </form>
              <div className="space-y-2.5 pt-2">
                {daftarKelompok.map((klp) => (
                  <div key={klp.id} className="p-4 border rounded-2xl bg-slate-50 text-xs space-y-1">
                    <div className="font-black text-sm">{klp.namaKelas}</div>
                    <p className="text-slate-600">{klp.pengumuman}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black">Jadwal Live Class (Zoom / Google Meet)</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!judulLiveBaru.trim()) return;
                  setJadwalLive([
                    {
                      id: "lv-" + Date.now(),
                      judulSesi: judulLiveBaru,
                      pengajarNama: userLogin.nama,
                      tanggalJam: jadwalJamLiveBaru || "Sabtu, 19:00 WIB",
                      meetingUrl: "https://meet.google.com",
                      targetKelas: "Semua Kelas",
                    },
                    ...jadwalLive,
                  ]);
                  setJudulLiveBaru("");
                  setJadwalJamLiveBaru("");
                }}
                className="space-y-3 text-sm"
              >
                <input
                  type="text"
                  required
                  value={judulLiveBaru}
                  onChange={(e) => setJudulLiveBaru(e.target.value)}
                  placeholder="Topik Sesi Live..."
                  className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                />
                <input
                  type="text"
                  value={jadwalJamLiveBaru}
                  onChange={(e) => setJadwalJamLiveBaru(e.target.value)}
                  placeholder="Hari & Jam (Misal: Minggu, 19:30 WIB)..."
                  className="w-full p-3 border rounded-xl bg-slate-50"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black"
                >
                  + Jadwalkan Sesi Live
                </button>
              </form>
              <div className="space-y-2.5 pt-2">
                {jadwalLive.map((lv) => (
                  <div key={lv.id} className="p-4 border rounded-2xl bg-slate-50 text-xs">
                    <div className="font-black text-sm">{lv.judulSesi}</div>
                    <div className="text-slate-500">{lv.tanggalJam}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {guruTabAktif === "rpp_repo" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-2">
                <FolderArchive className="w-6 h-6 text-indigo-600" /> Bank RPP, Modul Ajar
                Kurikulum Merdeka &amp; RPS Kampus
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!judulRppBaru.trim()) return;
                const baru: RppItem = {
                  id: "rpp-" + Date.now(),
                  judulRpp: judulRppBaru,
                  mataPelajaran: mapelRppBaru || "Umum",
                  jenjangKelas: jenjangRppBaru,
                  kurikulum: kurikulumRppBaru,
                  pembuatNama: userLogin.nama,
                  ringkasanTujuan: tujuanRppBaru,
                  fileUrl: urlRppBaru,
                  jumlahUnduhan: 1,
                  tanggalUpload: "Hari ini",
                };
                setRppList([baru, ...rppList]);
                setJudulRppBaru("");
                setTujuanRppBaru("");
                alert("Perangkat Ajar / RPP berhasil dipublikasikan!");
              }}
              className="p-6 bg-slate-50 border rounded-2xl space-y-4 text-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={judulRppBaru}
                  onChange={(e) => setJudulRppBaru(e.target.value)}
                  placeholder="Judul RPP / Modul Ajar..."
                  className="p-3.5 border rounded-xl bg-white font-bold"
                />
                <input
                  type="text"
                  required
                  value={mapelRppBaru}
                  onChange={(e) => setMapelRppBaru(e.target.value)}
                  placeholder="Mata Pelajaran..."
                  className="p-3.5 border rounded-xl bg-white"
                />
                <select
                  value={kurikulumRppBaru}
                  onChange={(e) =>
                    setKurikulumRppBaru(
                      e.target.value as "Kurikulum Merdeka" | "K13 Revisi" | "Silabus Kampus / RPS"
                    )
                  }
                  className="p-3.5 border rounded-xl bg-indigo-50 font-black"
                >
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                  <option value="K13 Revisi">Kurikulum 2013 Revisi</option>
                  <option value="Silabus Kampus / RPS">Silabus Kampus / RPS</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                value={tujuanRppBaru}
                onChange={(e) => setTujuanRppBaru(e.target.value)}
                placeholder="Ringkasan Capaian Pembelajaran (CP)..."
                className="w-full p-3.5 border rounded-xl bg-white"
              />
              <div className="flex gap-3">
                <input
                  type="url"
                  required
                  value={urlRppBaru}
                  onChange={(e) => setUrlRppBaru(e.target.value)}
                  placeholder="Link Dokumen PDF/Word RPP..."
                  className="flex-1 p-3.5 border rounded-xl bg-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black"
                >
                  + Bagikan RPP
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rppList.map((rpp) => (
                <div
                  key={rpp.id}
                  className="p-5 border rounded-2xl bg-white flex flex-col justify-between space-y-3 text-sm"
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {rpp.kurikulum} • {rpp.mataPelajaran}
                    </span>
                    <h3 className="font-black text-lg text-slate-900">{rpp.judulRpp}</h3>
                    <p className="text-slate-600 text-xs">{rpp.ringkasanTujuan}</p>
                  </div>
                  <a
                    href={rpp.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-center font-bold text-xs"
                  >
                    Unduh Dokumen RPP →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {guruTabAktif === "tugas_rubrik" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" /> Penilaian Tugas &amp; AI
                Rubric Scoring Assistant
              </h3>

              <div className="space-y-4">
                {daftarPengumpulan.map((sub) => {
                  const tugasInfo = daftarTugas.find((t) => t.id === sub.tugasId);
                  return (
                    <div
                      key={sub.id}
                      className="p-5 border rounded-2xl bg-slate-50 space-y-3 text-sm"
                    >
                      <div className="flex justify-between font-bold">
                        <span>
                          {sub.siswaNama} —{" "}
                          <span className="text-indigo-600">{tugasInfo?.judul || "Tugas"}</span>
                        </span>
                        <span className="text-xs text-slate-400">{sub.waktuKumpul}</span>
                      </div>
                      <p className="p-3.5 bg-white border rounded-xl text-slate-700">
                        {sub.jawabanTeksAtauLink}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-950">
                          Kriteria: Argumen (40%), Tata Bahasa (30%), Referensi (30%)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const hasilAi = analisisRubrikEsaiAI(sub.jawabanTeksAtauLink);
                            setInputNilaiGuru({
                              ...inputNilaiGuru,
                              [sub.id]: hasilAi.rekomendasiTotal,
                            });
                            setInputFeedbackGuru({
                              ...inputFeedbackGuru,
                              [sub.id]: hasilAi.catatanAi,
                            });
                          }}
                          className="bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
                        >
                          <Wand2 className="w-3.5 h-3.5" /> ⚡ Jalankan AI Rubric Scoring
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <input
                          type="number"
                          value={inputNilaiGuru[sub.id] ?? sub.nilai ?? 90}
                          onChange={(e) =>
                            setInputNilaiGuru({
                              ...inputNilaiGuru,
                              [sub.id]: Number(e.target.value),
                            })
                          }
                          className="w-24 p-2.5 border rounded-xl bg-white font-black text-center"
                        />
                        <input
                          type="text"
                          value={inputFeedbackGuru[sub.id] ?? sub.feedbackGuru ?? ""}
                          onChange={(e) =>
                            setInputFeedbackGuru({
                              ...inputFeedbackGuru,
                              [sub.id]: e.target.value,
                            })
                          }
                          placeholder="Catatan Feedback Guru..."
                          className="flex-1 p-2.5 border rounded-xl bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const n = inputNilaiGuru[sub.id] ?? sub.nilai ?? 90;
                            const fb =
                              inputFeedbackGuru[sub.id] ?? sub.feedbackGuru ?? "Sangat baik!";
                            setDaftarPengumpulan((prev) =>
                              prev.map((s) =>
                                s.id === sub.id ? { ...s, nilai: n, feedbackGuru: fb } : s
                              )
                            );
                            kirimNotifikasiKeUser(
                              [sub.siswaId],
                              "Tugas Dinilai",
                              `Nilai Anda: ${n}/100. ${fb}`,
                              userLogin.nama
                            );
                            alert("Nilai divalidasi!");
                          }}
                          className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold"
                        >
                          Validasi Nilai
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Log Presensi Otomatis &amp; QR Ujian
              </h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {daftarPresensi.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-3.5 border rounded-2xl bg-emerald-50/50 flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="font-black text-slate-900">{pr.siswaNama}</div>
                      <div className="text-slate-600">{pr.materiJudul}</div>
                    </div>
                    <span className="font-mono bg-white px-2.5 py-1 rounded-lg border font-bold text-emerald-700">
                      {pr.waktuHadir}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {guruTabAktif === "tryout_qr" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-3xl space-y-4">
              <h3 className="text-xl font-black flex items-center gap-2">
                <QrCode className="w-6 h-6 text-amber-400" /> Scanner Token QR Kartu Ujian Peserta
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tokenQrInput.trim()) return;
                  const jam = new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setDaftarPresensi([
                    {
                      id: "qr-" + Date.now(),
                      siswaId: "sis-1",
                      siswaNama: `Peserta Terverifikasi QR (${tokenQrInput.toUpperCase()})`,
                      materiJudul: "Presensi Fisik Ruangan CBT via QR Code",
                      waktuHadir: `${jam} WIB`,
                      metode: "Scan QR Ujian",
                    },
                    ...daftarPresensi,
                  ]);
                  setTokenQrInput("");
                  alert("✓ QR Code Valid! Kehadiran peserta ujian berhasil dicatat.");
                }}
                className="flex gap-3 max-w-xl"
              >
                <input
                  type="text"
                  required
                  value={tokenQrInput}
                  onChange={(e) => setTokenQrInput(e.target.value)}
                  placeholder="Ketik / Scan Token QR Peserta (Misal: HIBAH-SIS-1-TPA)..."
                  className="flex-1 p-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm"
                />
                <button
                  type="submit"
                  className="bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm"
                >
                  Verifikasi QR
                </button>
              </form>
            </div>

            <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
              <h3 className="text-2xl font-black">Rancang Paket Tryout CBT Baru</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!judulTryoutBaru.trim()) return;
                  const baru: PaketTryout = {
                    id: "pkt-" + Date.now(),
                    judul: judulTryoutBaru,
                    kategoriTes: kategoriTesBaru,
                    jenjang: "SMA & Kuliah",
                    pembuatId: userLogin.id,
                    pembuatNama: userLogin.nama,
                    alamatLokasi: alamatTryoutBaru,
                    jadwalUjian: "2026-11-15 09:00 WIB",
                    durasiMenit: 20,
                    batasPercobaan: 2,
                    batasPelanggaran: 3,
                    wajibFullscreen: true,
                    daftarSoal: soalTryoutDraft,
                  };
                  setDaftarPaketTryout([baru, ...daftarPaketTryout]);
                  setJudulTryoutBaru("");
                  alert("Paket Tryout CBT baru berhasil diterbitkan!");
                }}
                className="space-y-4 text-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    value={judulTryoutBaru}
                    onChange={(e) => setJudulTryoutBaru(e.target.value)}
                    placeholder="Nama Paket Ujian..."
                    className="p-3.5 border rounded-xl bg-slate-50 font-bold"
                  />
                  <select
                    value={kategoriTesBaru}
                    onChange={(e) => setKategoriTesBaru(e.target.value as KategoriTes)}
                    className="p-3.5 border rounded-xl bg-indigo-50 font-black"
                  >
                    <option value="TPA">TPA</option>
                    <option value="TOEP">TOEP</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="UTBK">UTBK</option>
                  </select>
                  <input
                    type="text"
                    value={alamatTryoutBaru}
                    onChange={(e) => setAlamatTryoutBaru(e.target.value)}
                    placeholder="Lokasi Ruangan..."
                    className="p-3.5 border rounded-xl bg-slate-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl"
                >
                  Terbitkan Paket Tryout CBT
                </button>
              </form>
            </div>
          </div>
        )}

        {guruTabAktif === "analitik" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h3 className="text-xl font-black">Grafik Keaktifan Belajar Siswa</h3>
            <div className="grid grid-cols-7 gap-3 items-end h-40 pt-4 px-2 bg-slate-50 rounded-2xl p-4">
              {[65, 80, 95, 70, 88, 100, 78].map((persen, i) => (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: `${persen}%` }}
                    className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-indigo-600 to-emerald-500"
                  />
                  <span className="text-xs font-bold">H-{7 - i}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {guruTabAktif === "bank_soal" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black">Bank Soal Kolektif Bersama</h3>
            {bankSoalKolektif.map((bs) => (
              <div key={bs.id} className="p-4 border rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-indigo-600">
                    {bs.rumus} • {bs.penyumbangNama}
                  </span>
                  <p className="font-bold">{bs.pertanyaan}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 3. PANEL SUPER ADMIN PERSIS SCREENSHOT (EDIT USER & KATEGORI KELAS, CSV, DLL.)
  // ============================================================================
  if (userLogin.role === "admin") {
    return (
      <div className="space-y-8">
        {/* Banner Gelap Super Admin Persis Screenshot */}
        <div className="bg-[#0B1120] text-white p-8 sm:p-10 rounded-[2rem] space-y-6 shadow-2xl">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
              SUPER ADMIN
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mt-3">{userLogin.nama}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadRekapCsvExcel}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Unduh Rekap Excel (.CSV)
            </button>
            <button
              onClick={() => setAdminModeGuru(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Buka Studio Mode Guru
            </button>
            <button
              onClick={() => setBukaModalImportCsvAkun(!bukaModalImportCsvAkun)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Import CSV Akun
            </button>
            <button
              onClick={() => setBukaModalTambahAkun(!bukaModalTambahAkun)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> + Tambah Akun
            </button>
            <button
              onClick={() => setUserLogin(null)}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        {/* 5 Tab Navigasi Super Admin Persis Screenshot */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {[
            { id: "akun", label: `Data Akun (${daftarAkun.length})` },
            { id: "beasiswa", label: `Verifikasi Beasiswa (${daftarBeasiswa.length})` },
            { id: "kategori", label: "Kategori & Prodi" },
            { id: "cv", label: "Profil & CV Saya" },
            { id: "log", label: "Log Audit" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setAdminTabAktif(t.id as "akun" | "beasiswa" | "kategori" | "cv" | "log")
              }
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black cursor-pointer ${
                adminTabAktif === t.id
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border border-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MODAL IMPORT CSV AKUN */}
        {bukaModalImportCsvAkun && (
          <div className="bg-white text-slate-800 p-6 rounded-3xl border-2 border-indigo-500 space-y-4 text-sm">
            <h3 className="font-black text-lg">Import Massal Akun Guru &amp; Siswa via CSV</h3>
            <textarea
              rows={4}
              value={teksCsvAkun}
              onChange={(e) => setTeksCsvAkun(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-50 border rounded-xl"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const baris = teksCsvAkun.trim().split("\n").slice(1);
                  const akunBaruList: AkunPengguna[] = baris
                    .map((b, i) => {
                      const k = b.split(";");
                      return {
                        id: "csv-u-" + Date.now() + "-" + i,
                        nama: k[0] || "Pengguna Baru",
                        email: k[1] || `user${i}@hibahilmu.id`,
                        password: k[2] || "123",
                        role: (k[3] as "siswa" | "guru" | "admin") || "siswa",
                        status: "approved" as const,
                        infoTambahan: k[4] || "Terdaftar via CSV",
                        waktuDaftar: "Hari ini",
                        aksesMengajar: ["sma-11-ipa"],
                        minatSubJenjang: ["sma-11-ipa"],
                      };
                    })
                    .filter((x) => x.email);
                  setDaftarAkun([...akunBaruList, ...daftarAkun]);
                  setBukaModalImportCsvAkun(false);
                }}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-xs"
              >
                Import Sekarang
              </button>
              <button
                onClick={() => setBukaModalImportCsvAkun(false)}
                className="border px-4 py-2.5 rounded-xl font-bold text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH AKUN MANUAL OLEH ADMIN */}
        {bukaModalTambahAkun && (
          <div className="bg-white text-slate-800 p-6 rounded-3xl border-2 border-emerald-500 space-y-4 text-sm">
            <h3 className="font-black text-lg">Tambah Akun Pengguna Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!namaReg || !emailReg) return;
                const baru: AkunPengguna = {
                  id: "adm-u-" + Date.now(),
                  nama: namaReg,
                  email: emailReg,
                  password: passwordReg || "123",
                  role: roleReg,
                  status: "approved",
                  infoTambahan: roleReg === "guru" ? "Pengajar Terverifikasi" : "Pelajar Aktif",
                  waktuDaftar: "Hari ini",
                  aksesMengajar: ["sma-11-ipa"],
                  minatSubJenjang: ["sma-11-ipa"],
                };
                setDaftarAkun([baru, ...daftarAkun]);
                setNamaReg("");
                setEmailReg("");
                setBukaModalTambahAkun(false);
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <input
                type="text"
                required
                value={namaReg}
                onChange={(e) => setNamaReg(e.target.value)}
                placeholder="Nama Lengkap..."
                className="p-3 border rounded-xl"
              />
              <input
                type="email"
                required
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                placeholder="Email..."
                className="p-3 border rounded-xl"
              />
              <select
                value={roleReg}
                onChange={(e) => setRoleReg(e.target.value as "siswa" | "guru")}
                className="p-3 border rounded-xl font-bold"
              >
                <option value="siswa">Role: Siswa</option>
                <option value="guru">Role: Guru</option>
              </select>
              <button
                type="submit"
                className="bg-emerald-600 text-white font-black rounded-xl px-4 py-3"
              >
                Simpan Akun
              </button>
            </form>
          </div>
        )}

        {/* MODAL EDIT USER & PENENTUAN KATEGORI KELAS OLEH ADMIN */}
        {akunDieditAdmin && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-600 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-xs font-black uppercase text-indigo-600">
                  Manajemen Hak Akses &amp; Kategori Kelas Pengguna
                </span>
                <h3 className="text-xl font-black">Edit Akun: {akunDieditAdmin.nama}</h3>
              </div>
              <button
                onClick={() => setAkunDieditAdmin(null)}
                className="text-xs font-black text-rose-600"
              >
                ✕ Tutup Editor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="text-xs font-bold text-slate-500">Nama Pengguna</label>
                <input
                  type="text"
                  value={akunDieditAdmin.nama}
                  onChange={(e) =>
                    setAkunDieditAdmin({ ...akunDieditAdmin, nama: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl font-bold mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Email</label>
                <input
                  type="email"
                  value={akunDieditAdmin.email}
                  onChange={(e) =>
                    setAkunDieditAdmin({ ...akunDieditAdmin, email: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Role / Peran</label>
                <select
                  value={akunDieditAdmin.role}
                  onChange={(e) =>
                    setAkunDieditAdmin({
                      ...akunDieditAdmin,
                      role: e.target.value as "admin" | "guru" | "siswa",
                    })
                  }
                  className="w-full p-3 border rounded-xl font-black mt-1 bg-indigo-50"
                >
                  <option value="siswa">SISWA</option>
                  <option value="guru">GURU / PENGAJAR</option>
                  <option value="admin">SUPER ADMIN</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Status Verifikasi</label>
                <select
                  value={akunDieditAdmin.status}
                  onChange={(e) =>
                    setAkunDieditAdmin({
                      ...akunDieditAdmin,
                      status: e.target.value as "approved" | "pending" | "rejected",
                    })
                  }
                  className="w-full p-3 border rounded-xl font-black mt-1 bg-emerald-50"
                >
                  <option value="approved">APPROVED (Aktif)</option>
                  <option value="pending">PENDING</option>
                  <option value="rejected">REJECTED</option>
                </select>
              </div>
            </div>

            {/* CHECKBOX PENENTUAN KATEGORI KELAS / SUB-JENJANG USER */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase text-slate-700">
                {akunDieditAdmin.role === "siswa"
                  ? "Tentukan Kategori Kelas / Prodi yang Diikuti Siswa Ini:"
                  : "Tentukan Hak Akses Kelas / Prodi Tempat Guru Ini Mengajar:"}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-4 bg-slate-50 rounded-2xl border max-h-60 overflow-y-auto">
                {semuaSubJenjangFlat.map((sj) => {
                  const listSaatIni =
                    akunDieditAdmin.role === "siswa"
                      ? akunDieditAdmin.minatSubJenjang || []
                      : akunDieditAdmin.aksesMengajar || [];
                  const dicentang = listSaatIni.includes(sj.id);

                  return (
                    <label
                      key={sj.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        dicentang
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={dicentang}
                        onChange={() => {
                          const baru = dicentang
                            ? listSaatIni.filter((id) => id !== sj.id)
                            : [...listSaatIni, sj.id];
                          if (akunDieditAdmin.role === "siswa") {
                            setAkunDieditAdmin({ ...akunDieditAdmin, minatSubJenjang: baru });
                          } else {
                            setAkunDieditAdmin({ ...akunDieditAdmin, aksesMengajar: baru });
                          }
                        }}
                        className="accent-white"
                      />
                      <span>
                        {sj.namaInduk} — {sj.nama}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDaftarAkun(
                    daftarAkun.map((a) => (a.id === akunDieditAdmin.id ? akunDieditAdmin : a))
                  );
                  if (userLogin.id === akunDieditAdmin.id) setUserLogin(akunDieditAdmin);
                  setAkunDieditAdmin(null);
                  alert("Data pengguna dan penempatan kategori kelas berhasil diperbarui!");
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs"
              >
                Simpan Perubahan User
              </button>
            </div>
          </div>
        )}

        {adminTabAktif === "cv" && renderProfilDanCV()}

        {adminTabAktif === "akun" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border border-slate-200 space-y-4">
            {daftarAkun.map((akun) => {
              const kategoriUser =
                akun.role === "siswa" ? akun.minatSubJenjang || [] : akun.aksesMengajar || [];
              return (
                <div
                  key={akun.id}
                  className="p-5 rounded-2xl border border-slate-300 bg-white flex flex-wrap justify-between items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-black text-base flex flex-wrap items-center gap-2">
                      <span>{akun.nama}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {akun.role}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {akun.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{akun.email}</div>
                    {kategoriUser.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {kategoriUser.map((kid) => {
                          const namaKls =
                            semuaSubJenjangFlat.find((s) => s.id === kid)?.nama || kid;
                          return (
                            <span
                              key={kid}
                              className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border"
                            >
                              Kelas: {namaKls}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tombol Ikon Edit (Pensil Biru) & Hapus (Merah) Persis Screenshot */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAkunDieditAdmin(akun)}
                      className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"
                      title="Edit User & Tentukan Kategori Kelas"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {akun.role !== "admin" && (
                      <button
                        onClick={() =>
                          setDaftarAkun(daftarAkun.filter((a) => a.id !== akun.id))
                        }
                        className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB KATEGORI & PRODI OLEH SUPER ADMIN */}
        {adminTabAktif === "kategori" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <h3 className="text-xl font-black">
              Manajemen Kategori Tingkat Kelas &amp; Program Studi
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!namaSubJenjangBaru.trim()) return;
                const idBaru =
                  jenjangIndukKategoriBaru + "-" + Date.now().toString().slice(-4);
                setDaftarJenjang((prev) =>
                  prev.map((j) =>
                    j.id === jenjangIndukKategoriBaru
                      ? {
                          ...j,
                          subJenjang: [...j.subJenjang, { id: idBaru, nama: namaSubJenjangBaru }],
                        }
                      : j
                  )
                );
                setNamaSubJenjangBaru("");
                alert("Tingkat Kelas / Prodi baru berhasil ditambahkan!");
              }}
              className="flex flex-wrap gap-3 text-sm"
            >
              <select
                value={jenjangIndukKategoriBaru}
                onChange={(e) => setJenjangIndukKategoriBaru(e.target.value)}
                className="p-3.5 border rounded-xl font-bold bg-slate-50"
              >
                {daftarJenjang.map((j) => (
                  <option key={j.id} value={j.id}>
                    Jenjang: {j.nama}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={namaSubJenjangBaru}
                onChange={(e) => setNamaSubJenjangBaru(e.target.value)}
                placeholder="Nama Tingkat Kelas / Prodi Baru (Misal: Kelas 12 IPS / S1 Kedokteran)..."
                className="flex-1 p-3.5 border rounded-xl"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black"
              >
                + Tambah Kategori Kelas
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {daftarJenjang.map((j) => (
                <div key={j.id} className="p-5 border rounded-2xl bg-slate-50 space-y-2">
                  <div className="font-black text-base">{j.nama}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {j.subJenjang.map((sj) => (
                      <span
                        key={sj.id}
                        className="px-3 py-1 bg-white border rounded-xl text-xs font-bold flex items-center gap-1.5"
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

        {adminTabAktif === "beasiswa" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h2 className="text-xl font-black">Verifikasi Pengajuan Beasiswa Pelajar</h2>
            {daftarBeasiswa.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-2xl bg-slate-50 flex justify-between items-center"
              >
                <div>
                  <div className="font-black">
                    {b.pemohonNama} — {b.jenisBeasiswa} ({b.status})
                  </div>
                  <p className="text-xs text-slate-600">{b.alasanPengajuan}</p>
                </div>
                <button
                  onClick={() =>
                    setDaftarBeasiswa(
                      daftarBeasiswa.map((x) =>
                        x.id === b.id ? { ...x, status: "Disetujui" } : x
                      )
                    )
                  }
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Setujui
                </button>
              </div>
            ))}
          </div>
        )}

        {adminTabAktif === "log" && (
          <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-2">
            {logAktivitas.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border rounded-xl text-xs">
                <b>{log.namaPelaku}:</b> {log.aksi} ({log.waktu})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 4. PORTAL PELAJAR / SISWA
  // ============================================================================
  const kirimanSaya = daftarPengumpulan.filter((s) => s.siswaId === userLogin.id);
  const karyaSaya = userLogin.cv?.karyaPublik || [];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 rounded-[2rem] flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div>
          <span className="bg-white/20 text-xs font-black px-3 py-1 rounded-full uppercase">
            Portal Akademik Pelajar
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">Halo, {userLogin.nama}!</h1>
          <p className="text-emerald-100 text-sm">
            Total XP: <b>{poinXP} XP</b> • Modul Selesai: <b>{materiSelesai.length} Modul</b>
          </p>
        </div>
        <button
          onClick={() => setUserLogin(null)}
          className="bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          {
            id: "showcase_publik",
            label: "1. Portofolio Publik Siswa (Showcase)",
            icon: <Globe className="w-4 h-4" />,
          },
          {
            id: "quests_study",
            label: "2. Weekly Quests & Study Room",
            icon: <Target className="w-4 h-4" />,
          },
          {
            id: "tugas",
            label: "3. Tugas & Nilai Rubrik AI",
            icon: <ClipboardCheck className="w-4 h-4" />,
          },
          {
            id: "rapor_sertifikat",
            label: "4. Rapor & Sertifikat PDF",
            icon: <Award className="w-4 h-4" />,
          },
          { id: "beasiswa", label: "5. Portal Beasiswa", icon: <Coins className="w-4 h-4" /> },
          { id: "cv", label: "6. Edit Profil & CV", icon: <Briefcase className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setSiswaTabAktif(
                t.id as
                  | "showcase_publik"
                  | "quests_study"
                  | "tugas"
                  | "rapor_sertifikat"
                  | "beasiswa"
                  | "cv"
              )
            }
            className={`px-4 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 whitespace-nowrap ${
              siswaTabAktif === t.id
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-700 border"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {siswaTabAktif === "cv" && renderProfilDanCV()}

      {siswaTabAktif === "showcase_publik" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl border-2 border-emerald-400 overflow-hidden bg-slate-800 flex items-center justify-center text-3xl font-black">
                  {userLogin.cv?.fotoUrl ? (
                    <img
                      src={userLogin.cv.fotoUrl}
                      alt={userLogin.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userLogin.nama.charAt(0)
                  )}
                </div>
                <div>
                  <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-0.5 rounded-full uppercase">
                    Verified Student Showcase
                  </span>
                  <h2 className="text-3xl font-black mt-1">{userLogin.nama}</h2>
                  <p className="text-sm text-emerald-200">
                    {userLogin.cv?.headline || userLogin.infoTambahan} •{" "}
                    {userLogin.cv?.asalSekolahKampus || "Pelajar Indonesia"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://hibahilmu.id/showcase/${userLogin.id}`
                  );
                  alert(
                    `Tautan Portofolio Publik berhasil disalin: https://hibahilmu.id/showcase/${userLogin.id}`
                  );
                }}
                className="bg-white/15 hover:bg-white/25 text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 border border-white/20 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Bagikan Link Portofolio Publik
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Tambah Karya ke Showcase Publik
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!judulKaryaBaru.trim()) return;
                  const karyaBaru = {
                    id: "kr-" + Date.now(),
                    judulKarya: judulKaryaBaru,
                    kategori: kategoriKaryaBaru,
                    deskripsi: deskripsiKaryaBaru,
                    linkKarya: linkKaryaBaru,
                    tanggal: "Oktober 2026",
                  };
                  const cvUpdate: BiodataCV = {
                    ...(userLogin.cv || {
                      fotoUrl: "",
                      headline: userLogin.infoTambahan,
                      bioSingkat: "",
                      asalSekolahKampus: "",
                      pendidikanTerakhir: "",
                      skills: [],
                      pengalaman: [],
                      prestasi: [],
                      portfolioUrl: "",
                    }),
                    karyaPublik: [karyaBaru, ...karyaSaya],
                  };
                  const updatedUser = { ...userLogin, cv: cvUpdate };
                  setUserLogin(updatedUser);
                  setJudulKaryaBaru("");
                  setDeskripsiKaryaBaru("");
                  tambahXP(35);
                }}
                className="space-y-3 text-sm"
              >
                <input
                  type="text"
                  required
                  value={judulKaryaBaru}
                  onChange={(e) => setJudulKaryaBaru(e.target.value)}
                  placeholder="Judul Karya / Proyek..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                />
                <textarea
                  rows={2}
                  required
                  value={deskripsiKaryaBaru}
                  onChange={(e) => setDeskripsiKaryaBaru(e.target.value)}
                  placeholder="Deskripsi singkat karya..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50"
                />
                <input
                  type="url"
                  value={linkKaryaBaru}
                  onChange={(e) => setLinkKaryaBaru(e.target.value)}
                  placeholder="Link GitHub / Google Drive..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-xl"
                >
                  + Publikasikan ke Showcase (+35 XP)
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
              <h3 className="text-lg font-black">Daftar Karya Publik Saya</h3>
              <div className="space-y-4">
                {karyaSaya.map((kr) => (
                  <div key={kr.id} className="p-5 border rounded-2xl bg-slate-50 space-y-2 text-sm">
                    <h4 className="font-black text-lg text-slate-900">{kr.judulKarya}</h4>
                    <p className="text-slate-600">{kr.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {siswaTabAktif === "quests_study" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black">Weekly Quests (Tantangan Mingguan)</h3>
            <div className="p-4 border rounded-2xl bg-slate-50 space-y-2">
              <div className="font-bold">Selesaikan Minimal 1 Modul Materi (+100 XP)</div>
              {!klaimQuestIds.includes("q1") ? (
                <button
                  onClick={() => {
                    setKlaimQuestIds(["q1"]);
                    tambahXP(100);
                  }}
                  className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs"
                >
                  Klaim Hadiah +100 XP
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-600">✓ Sudah Diklaim</span>
              )}
            </div>
          </div>

          <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black">Peer Study Rooms (Grup Belajar)</h3>
            {studyRooms.map((sr) => (
              <div key={sr.id} className="p-4 border rounded-2xl bg-slate-50 text-sm space-y-1">
                <div className="font-black">{sr.namaGrup}</div>
                <div className="text-xs text-slate-500">
                  Kode Undangan: <b>{sr.kodeUndangan}</b> • Anggota: {sr.anggotaNama.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {siswaTabAktif === "tugas" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
          <h3 className="text-xl font-black">Tugas Kelas &amp; Hasil Rubrik AI</h3>
          {daftarTugas.map((tgs) => {
            const kumpul = kirimanSaya.find((k) => k.tugasId === tgs.id);
            return (
              <div key={tgs.id} className="p-5 border rounded-2xl bg-slate-50 space-y-3 text-sm">
                <div className="font-black text-base">{tgs.judul}</div>
                <p className="text-slate-600">{tgs.instruksi}</p>
                {kumpul ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <b>Nilai: {kumpul.nilai ?? "Menunggu"} / 100</b> — {kumpul.feedbackGuru}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={jawabanTugasSiswaInput[tgs.id] || ""}
                      onChange={(e) =>
                        setJawabanTugasSiswaInput({
                          ...jawabanTugasSiswaInput,
                          [tgs.id]: e.target.value,
                        })
                      }
                      placeholder="Tuliskan argumen esai & link referensi..."
                      className="flex-1 p-3 bg-white border rounded-xl"
                    />
                    <button
                      onClick={() => {
                        const isi = jawabanTugasSiswaInput[tgs.id];
                        if (!isi) return;
                        setDaftarPengumpulan([
                          {
                            id: "sub-" + Date.now(),
                            tugasId: tgs.id,
                            siswaId: userLogin.id,
                            siswaNama: userLogin.nama,
                            jawabanTeksAtauLink: isi,
                            waktuKumpul: "Baru saja",
                          },
                          ...daftarPengumpulan,
                        ]);
                        tambahXP(40);
                      }}
                      className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-black"
                    >
                      Kirim Tugas
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {siswaTabAktif === "rapor_sertifikat" && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 text-slate-900 p-10 rounded-[2.5rem] border-4 border-double border-amber-400 shadow-xl text-center space-y-4">
          <h2 className="text-3xl font-black">SERTIFIKAT PENGHARGAAN BELAJAR</h2>
          <div className="text-2xl font-black text-indigo-950 underline">{userLogin.nama}</div>
          <p className="text-sm text-slate-600">
            Telah menuntaskan {materiSelesai.length} Modul Pembelajaran dengan reputasi {poinXP} XP.
          </p>
          <button
            onClick={() => window.print()}
            className="bg-slate-900 text-white font-black px-6 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Cetak Sertifikat PDF
          </button>
        </div>
      )}

      {siswaTabAktif === "beasiswa" && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4 max-w-2xl">
          <h3 className="text-xl font-black">Pengajuan Beasiswa Pendidikan Gratis</h3>
          <input
            type="text"
            value={alasanBeasiswaInput}
            onChange={(e) => setAlasanBeasiswaInput(e.target.value)}
            placeholder="Tuliskan prestasi atau alasan pengajuan beasiswa..."
            className="w-full p-3.5 border rounded-xl bg-slate-50 text-sm"
          />
          <button
            onClick={() => {
              if (!alasanBeasiswaInput.trim()) return;
              setDaftarBeasiswa([
                {
                  id: "bea-" + Date.now(),
                  pemohonId: userLogin.id,
                  pemohonNama: userLogin.nama,
                  jenisBeasiswa: "Beasiswa Prestasi Sains",
                  alasanPengajuan: alasanBeasiswaInput,
                  nilaiRataRata: 92,
                  status: "Menunggu Verifikasi",
                  tanggalAjuan: "Hari ini",
                },
                ...daftarBeasiswa,
              ]);
              setAlasanBeasiswaInput("");
              alert("Pengajuan beasiswa terkirim!");
            }}
            className="bg-emerald-600 text-white font-black px-6 py-3.5 rounded-xl text-sm"
          >
            Kirim Pengajuan Beasiswa
          </button>
        </div>
      )}
    </div>
  );
};