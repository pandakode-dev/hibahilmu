"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Bell,
  LayoutDashboard,
  Sun,
  Moon,
  CheckCheck,
  Accessibility,
  Volume2,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

import {
  JenjangItem,
  KelasItem,
  AkunPengguna,
  NotifikasiItem,
  LogAktivitas,
  KelompokBelajar,
  PesanChatMateri,
  PaketTryout,
  RiwayatPercobaanTryout,
  TugasItem,
  PengumpulanTugas,
  PresensiItem,
  RppItem,
  OfficeHourItem,
  SoalTryout,
  JadwalLiveItem,
  StudyRoomItem,
  PengajuanBeasiswaItem,
  DiskusiPR,
  AgendaWebinarItem,
  KonfigurasiWeb,
  LaporanBugItem,
  TransparansiDonasi,
} from "./types";

import {
  STRUKTUR_AWAL,
  AKUN_DEFAULT,
  NOTIF_AWAL,
  LOG_AWAL,
  KELOMPOK_AWAL,
  PAKET_TRYOUT_AWAL,
  BANK_SOAL_KOLEKTIF_AWAL,
  TUGAS_AWAL,
  PENGUMPULAN_AWAL,
  JADWAL_LIVE_AWAL,
  AGENDA_WEBINAR_AWAL,
  STUDY_ROOMS_AWAL,
  BEASISWA_AWAL,
  RPP_REPOSITORY_AWAL,
  OFFICE_HOURS_AWAL,
  DISKUSI_PR_AWAL,
  KONFIGURASI_WEB_AWAL,
  LAPORAN_BUG_AWAL,
  DATA_TRANSPARANSI_DONASI,
} from "./mockData";

import { RuangBelajarView } from "./components/RuangBelajarView";
import { TryoutDanForumView } from "./components/TryoutDanForumView";
import { DashboardPanelView } from "./components/DashboardPanelView";
import {
  SmartAlertBanner,
  AgendaWebinarView,
} from "./components/AgendaDanAlertBanner";
import { DonasiDanBugView } from "./components/DonasiDanBugView";
import { FiturInovasiHubView } from "./components/FiturInovasiHubView";
import { SimulatorPemrogramanView } from "./components/simulator/SimulatorPemrogramanView";

export default function AplikasiHibahIlmu() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ukuranTeksBesar, setUkuranTeksBesar] = useState<boolean>(false);
  const [kontrasTinggi, setKontrasTinggi] = useState<boolean>(false);
  const [spasiTeksLebar, setSpasiTeksLebar] = useState<boolean>(false);
  const [bukaMenuAksesibilitas, setBukaMenuAksesibilitas] = useState<boolean>(false);

  const [menuAktif, setMenuAktif] = useState<string>("beranda");
  const [modeRoleAuth, setModeRoleAuth] = useState<"siswa" | "guru">("siswa");

  const [daftarJenjang, setDaftarJenjang] = useState<JenjangItem[]>(STRUKTUR_AWAL);
  const [jenjangAktif, setJenjangAktif] = useState<JenjangItem | null>(null);
  const [subJenjangAktif, setSubJenjangAktif] = useState<string>("semua");
  const [kelasAktif, setKelasAktif] = useState<KelasItem | null>(null);
  const [hanyaMateriDiikuti, setHanyaMateriDiikuti] = useState<boolean>(false);

  const [daftarAkun, setDaftarAkun] = useState<AkunPengguna[]>(AKUN_DEFAULT);
  const [userLogin, setUserLogin] = useState<AkunPengguna | null>(null);
  const [logAktivitas] = useState<LogAktivitas[]>(LOG_AWAL);
  const [daftarKelompok, setDaftarKelompok] = useState<KelompokBelajar[]>(KELOMPOK_AWAL);

  const [daftarNotifikasi, setDaftarNotifikasi] = useState<NotifikasiItem[]>(NOTIF_AWAL);
  const [bukaMenuNotif, setBukaMenuNotif] = useState<boolean>(false);

  const [konfigurasiWeb, setKonfigurasiWeb] =
    useState<KonfigurasiWeb>(KONFIGURASI_WEB_AWAL);
  const [daftarLaporanBug, setDaftarLaporanBug] =
    useState<LaporanBugItem[]>(LAPORAN_BUG_AWAL);
  const [dataDonasi, setDataDonasi] =
    useState<TransparansiDonasi>(DATA_TRANSPARANSI_DONASI);

  const [daftarTugas, setDaftarTugas] = useState<TugasItem[]>(TUGAS_AWAL);
  const [daftarPengumpulan, setDaftarPengumpulan] =
    useState<PengumpulanTugas[]>(PENGUMPULAN_AWAL);
  const [daftarPresensi, setDaftarPresensi] = useState<PresensiItem[]>([]);
  const [rppList, setRppList] = useState<RppItem[]>(RPP_REPOSITORY_AWAL);
  const [officeHours, setOfficeHours] = useState<OfficeHourItem[]>(OFFICE_HOURS_AWAL);
  const [bankSoalKolektif, setBankSoalKolektif] =
    useState<SoalTryout[]>(BANK_SOAL_KOLEKTIF_AWAL);
  const [jadwalLive, setJadwalLive] = useState<JadwalLiveItem[]>(JADWAL_LIVE_AWAL);
  const [agendaList, setAgendaList] =
    useState<AgendaWebinarItem[]>(AGENDA_WEBINAR_AWAL);
  const [studyRooms, setStudyRooms] = useState<StudyRoomItem[]>(STUDY_ROOMS_AWAL);
  const [daftarBeasiswa, setDaftarBeasiswa] =
    useState<PengajuanBeasiswaItem[]>(BEASISWA_AWAL);

  const [chatPerMateri, setChatPerMateri] = useState<{
    [materiId: string]: PesanChatMateri[];
  }>({
    "materi-sma-1": [
      {
        id: "ch-1",
        pengirimNama: "Aisyah Putri",
        pengirimRole: "siswa",
        pesan: "Pak Budi, apakah rumus Energi Kinetik selalu menggunakan satuan m/s?",
        waktu: "10:15 WIB",
      },
    ],
  });

  const [poinXP, setPoinXP] = useState<number>(480);
  const [materiSelesai, setMateriSelesai] = useState<string[]>(["materi-sma-1"]);

  const [skorKuisPerModul, setSkorKuisPerModul] = useState<{ [modulId: string]: number }>({
    "materi-sma-1": 90,
  });

  const [daftarPaketTryout, setDaftarPaketTryout] = useState<PaketTryout[]>(PAKET_TRYOUT_AWAL);
  const [riwayatTryout, setRiwayatTryout] = useState<RiwayatPercobaanTryout[]>([]);
  const [paketTryoutAktif, setPaketTryoutAktif] = useState<PaketTryout | null>(null);
  const [sedangUjian, setSedangUjian] = useState<boolean>(false);
  const [ujianSelesai, setUjianSelesai] = useState<boolean>(false);
  const [sisaWaktu, setSisaWaktu] = useState<number>(300);
  const [indeksSoalTryoutAktif, setIndeksSoalTryoutAktif] = useState<number>(0);
  const [jawabanUserTryout, setJawabanUserTryout] = useState<{ [key: number]: number }>({});
  const [skorTryout, setSkorTryout] = useState<number>(0);
  const [jumlahPelanggaranUjian, setJumlahPelanggaranUjian] = useState<number>(0);
  const [pesanPeringatanCheat, setPesanPeringatanCheat] = useState<string>("");

  const [daftarDiskusi, setDaftarDiskusi] = useState<DiskusiPR[]>(DISKUSI_PR_AWAL);

  const semuaModulFlat = daftarJenjang.flatMap((j) => j.kelas);

  useEffect(() => {
    if (kelasAktif && userLogin) {
      const jam = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDaftarPresensi((prev) => [
        {
          id: "pres-" + Date.now(),
          siswaId: userLogin.id,
          siswaNama: userLogin.nama,
          materiJudul: kelasAktif.judul,
          waktuHadir: `Hari ini, ${jam} WIB`,
        },
        ...prev,
      ]);
    }
  }, [kelasAktif]);

  const tambahXP = (tambahan: number) => {
    setPoinXP((prev) => prev + tambahan);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
  };

  const toggleSelesaiMateri = (kelasId: string) => {
    setMateriSelesai((prev) => {
      const sudah = prev.includes(kelasId);
      if (!sudah) tambahXP(30);
      return sudah ? prev.filter((id) => id !== kelasId) : [...prev, kelasId];
    });
  };

  const simpanSkorModul = (modulId: string, skorBaru: number, lulusKkm: boolean) => {
    setSkorKuisPerModul((prev) => ({
      ...prev,
      [modulId]: Math.max(prev[modulId] || 0, skorBaru),
    }));
    if (lulusKkm) {
      setMateriSelesai((prev) => (prev.includes(modulId) ? prev : [...prev, modulId]));
      tambahXP(50);
    }
  };

  const kirimBroadcastNotif = (
    judul: string,
    pesan: string,
    tipeNotif:
      | "tugas_deadline"
      | "kuis_tutup"
      | "webinar_live"
      | "bug_masukan"
      | "donasi_masuk"
      | "info_umum" = "info_umum"
  ) => {
    const baru: NotifikasiItem = {
      id: "notif-bc-" + Date.now(),
      targetUserId: "ALL",
      tipeNotif,
      judul,
      pesan,
      pengirim: userLogin?.nama || "Sistem Pengingat HibahIlmu",
      waktu: "Baru saja",
      dibaca: false,
    };
    setDaftarNotifikasi((prev) => [baru, ...prev]);
  };

  const handleKirimLaporanBugKeAdmin = (laporanBaru: LaporanBugItem) => {
    setDaftarLaporanBug((prev) => [laporanBaru, ...prev]);
    const notifUntukAdmin: NotifikasiItem = {
      id: "notif-bug-" + Date.now(),
      targetUserId: "ALL",
      tipeNotif: "bug_masukan",
      judul: `🐞 [${laporanBaru.kategoriLaporan}] dari ${laporanBaru.pelaporNama}`,
      pesan: `Halaman "${laporanBaru.halamanTerkait}": ${laporanBaru.deskripsiDetail} (Kontak: ${laporanBaru.pelaporKontak})`,
      pengirim: laporanBaru.pelaporNama,
      waktu: "Baru saja",
      dibaca: false,
    };
    setDaftarNotifikasi((prev) => [notifUntukAdmin, ...prev]);
  };

  const handleKirimNotifDonasiKeAdmin = (
    namaDonatur: string,
    nominal: number,
    metode: string
  ) => {
    const notifDonasi: NotifikasiItem = {
      id: "notif-don-" + Date.now(),
      targetUserId: "ALL",
      tipeNotif: "donasi_masuk",
      judul: `💝 Wakaf & Donasi Baru: Rp ${nominal.toLocaleString("id-ID")}`,
      pesan: `Donatur "${namaDonatur}" telah menyalurkan dukungan melalui ${metode}. Terima kasih atas kebaikannya!`,
      pengirim: namaDonatur,
      waktu: "Baru saja",
      dibaca: false,
    };
    setDaftarNotifikasi((prev) => [notifDonasi, ...prev]);
  };

  const handleKumpulTugasModul = (tugasId: string, jawabanTeks: string) => {
    if (!userLogin) return;
    const tugasInfo = daftarTugas.find((t) => t.id === tugasId);
    setDaftarPengumpulan((prev) => [
      {
        id: "sub-" + Date.now(),
        tugasId,
        siswaId: userLogin.id,
        siswaNama: userLogin.nama,
        jawabanTeksAtauLink: jawabanTeks,
        waktuKumpul: "Baru saja",
      },
      ...prev,
    ]);
    kirimBroadcastNotif(
      `📥 Tugas Dikumpulkan: ${tugasInfo?.judul || "Tugas Modul"}`,
      `Mahasiswa/Siswa ${userLogin.nama} telah mengumpulkan tugas sebelum batas waktu tutup.`,
      "tugas_deadline"
    );
    tambahXP(40);
  };

  const handleSetDaftarTugasDenganNotif = (listBaru: TugasItem[]) => {
    if (listBaru.length > daftarTugas.length) {
      const tugasTerbaru = listBaru[0];
      kirimBroadcastNotif(
        `📝 TUGAS BARU DIBUKA: ${tugasTerbaru.judul}`,
        `Pengajar ${tugasTerbaru.pembuatNama} telah menerbitkan tugas baru. Batas waktu tutup: ${tugasTerbaru.deadline}.`,
        "tugas_deadline"
      );
    }
    setDaftarTugas(listBaru);
  };

  const kirimNotifikasiKeUser = (
    targetIds: string[],
    judul: string,
    pesan: string,
    pengirim: string,
    namaKelas?: string
  ) => {
    const baru: NotifikasiItem[] = targetIds.map((uid, i) => ({
      id: "notif-" + Date.now() + "-" + i,
      targetUserId: uid,
      tipeNotif: "info_umum",
      judul,
      pesan,
      pengirim,
      namaKelas,
      waktu: "Baru saja",
      dibaca: false,
    }));
    setDaftarNotifikasi((prev) => [...baru, ...prev]);
  };

  const mulaiUjianTryout = (pkt: PaketTryout) => {
    if (pkt.wajibFullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setPaketTryoutAktif(pkt);
    setJawabanUserTryout({});
    setIndeksSoalTryoutAktif(0);
    setJumlahPelanggaranUjian(0);
    setPesanPeringatanCheat("");
    setSisaWaktu(pkt.durasiMenit * 60);
    setUjianSelesai(false);
    setSedangUjian(true);
  };

  const selesaikanTryout = (
    skorManual?: number,
    pelanggaranManual?: number,
    statusManual?: "Selesai Normal" | "Diskualifikasi (Auto-Submit)"
  ) => {
    if (!paketTryoutAktif || !userLogin) return;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    const nilai = skorManual ?? 0;
    const totPelanggaran = pelanggaranManual ?? jumlahPelanggaranUjian;
    setSkorTryout(nilai);
    setJumlahPelanggaranUjian(totPelanggaran);
    setUjianSelesai(true);
    setSedangUjian(false);
    setRiwayatTryout((prev) => [
      {
        id: "rw-" + Date.now(),
        paketId: paketTryoutAktif.id,
        paketJudul: paketTryoutAktif.judul,
        userId: userLogin.id,
        userNama: userLogin.nama,
        skor: nilai,
        jumlahPelanggaran: totPelanggaran,
        waktuSelesai: "Baru saja",
        statusAkhir: statusManual || "Selesai Normal",
      },
      ...prev,
    ]);
    if (nilai > 0) tambahXP(50);
  };

  const bacakanLayarAksesibilitas = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        `Selamat datang di Hibah Ilmu Indonesia. Anda sedang berada di menu ${menuAktif}.`
      );
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
    }
  };

  const notifikasiUserAktif = daftarNotifikasi.filter((n) =>
    userLogin ? n.targetUserId === userLogin.id || n.targetUserId === "ALL" : n.targetUserId === "ALL"
  );
  const jumlahBelumDibaca = notifikasiUserAktif.filter((n) => !n.dibaca).length;

  // ==========================================================================
  // PROTEKSI LOGIN WAJIB (AUTH GUARD):
  // Pengunjung belum login HANYA bisa melihat halaman utama Beranda.
  // Jika memilih menu selain beranda ATAU membuka jenjang/modul kelas, wajib login!
  // ==========================================================================
  const butuhLoginSekarang =
    !userLogin && (menuAktif !== "beranda" || jenjangAktif !== null || kelasAktif !== null);

  return (
    <div
      className={`min-h-screen font-sans antialiased relative overflow-x-hidden transition-colors duration-200 ${
        kontrasTinggi
          ? "bg-black text-yellow-300 contrast-125"
          : darkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-[#F8FAFC] text-slate-800"
      } ${ukuranTeksBesar ? "text-lg leading-relaxed" : "text-base leading-normal"} ${
        spasiTeksLebar ? "tracking-wider leading-loose" : ""
      }`}
    >
      {/* HEADER NAVBAR */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-xs ${
          darkMode || kontrasTinggi
            ? "bg-slate-900/95 border-slate-800"
            : "bg-white/90 border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div
            onClick={() => {
              setMenuAktif("beranda");
              setJenjangAktif(null);
              setKelasAktif(null);
            }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <img
              src="/hibahilmu.jpg"
              alt="Logo HibahIlmu"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80";
              }}
              className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-emerald-500 group-hover:scale-105 transition"
            />
            <div>
              <div className="font-black text-2xl tracking-tight leading-none">HibahIlmu.id</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider mt-1">
                WAKAF &amp; HIBAH ILMU GRATIS
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "beranda", label: "Beranda & Kelas" },
              { id: "simulator", label: "💻 Simulator Coding & IoT" },
              { id: "inovasi", label: "✨ Hub Inovasi" },
              { id: "webinar", label: "🔴 Webinar" },
              { id: "tryout", label: "Tryout CBT" },
              { id: "donasi", label: "💝 Wakaf & Donasi" },
              { id: "lapor_bug", label: "🐞 Lapor Bug" },
              { id: "forum", label: "Forum PR" },
              { id: "leaderboard", label: "Leaderboard" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-extrabold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  menuAktif === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : darkMode || kontrasTinggi
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {!userLogin && tab.id !== "beranda" && (
                  <Lock className="w-3 h-3 opacity-70" />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => setBukaMenuAksesibilitas(!bukaMenuAksesibilitas)}
                className="p-2.5 rounded-xl border bg-indigo-50 text-indigo-800 cursor-pointer"
                title="Fitur Ramah Disabilitas (Aksesibilitas)"
              >
                <Accessibility className="w-4 h-4" />
              </button>

              {bukaMenuAksesibilitas && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-3xl shadow-2xl border-2 border-indigo-200 p-4 z-50 space-y-2.5 text-xs">
                  <div className="font-black text-sm border-b pb-2 text-indigo-950">
                    ♿ Pengaturan Ramah Disabilitas
                  </div>
                  <button
                    onClick={() => setUkuranTeksBesar(!ukuranTeksBesar)}
                    className="w-full text-left p-2.5 rounded-xl border font-bold flex justify-between items-center cursor-pointer"
                  >
                    <span>Perbesar Font Teks</span>
                    <b>{ukuranTeksBesar ? "Aktif ✓" : "Normal"}</b>
                  </button>
                  <button
                    onClick={() => setKontrasTinggi(!kontrasTinggi)}
                    className="w-full text-left p-2.5 rounded-xl border font-bold flex justify-between items-center cursor-pointer"
                  >
                    <span>Mode Kontras Tinggi</span>
                    <b>{kontrasTinggi ? "Aktif ✓" : "Mati"}</b>
                  </button>
                  <button
                    onClick={() => setSpasiTeksLebar(!spasiTeksLebar)}
                    className="w-full text-left p-2.5 rounded-xl border font-bold flex justify-between items-center cursor-pointer"
                  >
                    <span>Spasi Huruf Lebar (Disleksia)</span>
                    <b>{spasiTeksLebar ? "Aktif ✓" : "Normal"}</b>
                  </button>
                  <button
                    onClick={bacakanLayarAksesibilitas}
                    className="w-full p-2.5 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" /> Bacakan Panduan Layar (TTS)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border cursor-pointer"
              title="Mode Gelap / Terang"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs sm:text-sm font-black">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setBukaMenuNotif(!bukaMenuNotif)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {jumlahBelumDibaca > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                    {jumlahBelumDibaca}
                  </span>
                )}
              </button>

              {bukaMenuNotif && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-3xl shadow-2xl border-2 border-slate-200 p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-black text-sm">
                      Pusat Notifikasi ({notifikasiUserAktif.length})
                    </span>
                    <button
                      onClick={() =>
                        setDaftarNotifikasi((prev) =>
                          prev.map((n) => ({ ...n, dibaca: true }))
                        )
                      }
                      className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {notifikasiUserAktif.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                          n.tipeNotif === "bug_masukan"
                            ? "bg-indigo-50/90 border-indigo-300"
                            : n.tipeNotif === "donasi_masuk"
                            ? "bg-emerald-50/90 border-emerald-300"
                            : n.tipeNotif === "tugas_deadline"
                            ? "bg-amber-50/80 border-amber-300"
                            : n.tipeNotif === "webinar_live"
                            ? "bg-rose-50/80 border-rose-300"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-slate-900">{n.judul}</span>
                          <span className="text-[10px] text-slate-400">{n.waktu}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{n.pesan}</p>
                        <div className="text-[10px] font-bold text-indigo-600 pt-0.5">
                          Oleh: {n.pengirim}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Masuk / Daftar"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING ALERT BANNER */}
      <SmartAlertBanner
        userLogin={userLogin}
        agendaList={agendaList}
        daftarTugas={daftarTugas}
        daftarPengumpulan={daftarPengumpulan}
        semuaModul={semuaModulFlat}
        onBukaMenuAgenda={() => {
          setMenuAktif("webinar");
          setJenjangAktif(null);
          setKelasAktif(null);
        }}
        onBukaMenuTugas={() => {
          setMenuAktif("dashboard");
          setJenjangAktif(null);
          setKelasAktif(null);
        }}
      />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {butuhLoginSekarang ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-black/25">
                  <Lock className="w-7 h-7 text-amber-200" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black/25">
                    Akses Terproteksi • Wajib Login Akun
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                    Silakan Masuk (Login) sebagai Siswa atau Pengajar Terlebih Dahulu
                  </h2>
                  <p className="text-xs text-white/90">
                    Untuk mengakses Kelas, Simulator Coding &amp; IoT, Hub Inovasi, Webinar,
                    Tryout CBT, maupun Forum, Anda wajib masuk ke akun Anda agar progres &amp;
                    project tersimpan aman.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuAktif("beranda");
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs cursor-pointer shrink-0"
              >
                ← Kembali ke Beranda
              </button>
            </div>

            <DashboardPanelView
              userLogin={userLogin}
              setUserLogin={setUserLogin}
              daftarAkun={daftarAkun}
              setDaftarAkun={setDaftarAkun}
              daftarJenjang={daftarJenjang}
              setDaftarJenjang={setDaftarJenjang}
              daftarPaketTryout={daftarPaketTryout}
              setDaftarPaketTryout={setDaftarPaketTryout}
              riwayatTryout={riwayatTryout}
              daftarTugas={daftarTugas}
              setDaftarTugas={handleSetDaftarTugasDenganNotif}
              daftarPengumpulan={daftarPengumpulan}
              setDaftarPengumpulan={setDaftarPengumpulan}
              daftarPresensi={daftarPresensi}
              setDaftarPresensi={setDaftarPresensi}
              rppList={rppList}
              setRppList={setRppList}
              bankSoalKolektif={bankSoalKolektif}
              setBankSoalKolektif={setBankSoalKolektif}
              daftarKelompok={daftarKelompok}
              setDaftarKelompok={setDaftarKelompok}
              jadwalLive={jadwalLive}
              setJadwalLive={setJadwalLive}
              studyRooms={studyRooms}
              setStudyRooms={setStudyRooms}
              daftarBeasiswa={daftarBeasiswa}
              setDaftarBeasiswa={setDaftarBeasiswa}
              logAktivitas={logAktivitas}
              poinXP={poinXP}
              materiSelesai={materiSelesai}
              tambahXP={tambahXP}
              kirimNotifikasiKeUser={kirimNotifikasiKeUser}
              konfigurasiWeb={konfigurasiWeb}
              setKonfigurasiWeb={setKonfigurasiWeb}
              daftarLaporanBug={daftarLaporanBug}
              setDaftarLaporanBug={setDaftarLaporanBug}
              modeRoleAwalAuth={modeRoleAuth}
            />
          </div>
        ) : (
          <>
            {menuAktif === "beranda" && (
              <RuangBelajarView
                daftarJenjang={daftarJenjang}
                jenjangAktif={jenjangAktif}
                setJenjangAktif={setJenjangAktif}
                subJenjangAktif={subJenjangAktif}
                setSubJenjangAktif={setSubJenjangAktif}
                kelasAktif={kelasAktif}
                setKelasAktif={setKelasAktif}
                userLogin={userLogin}
                hanyaMateriDiikuti={hanyaMateriDiikuti}
                setHanyaMateriDiikuti={setHanyaMateriDiikuti}
                materiSelesai={materiSelesai}
                toggleSelesaiMateri={toggleSelesaiMateri}
                skorKuisPerModul={skorKuisPerModul}
                simpanSkorModul={simpanSkorModul}
                daftarTugas={daftarTugas}
                daftarPengumpulan={daftarPengumpulan}
                onKumpulTugasModul={handleKumpulTugasModul}
                tambahXP={tambahXP}
                chatPerMateri={chatPerMateri}
                onKirimChatMateri={(pesan) => {
                  if (!kelasAktif || !userLogin) return;
                  const list = chatPerMateri[kelasAktif.id] || [];
                  setChatPerMateri({
                    ...chatPerMateri,
                    [kelasAktif.id]: [
                      ...list,
                      {
                        id: "ch-" + Date.now(),
                        pengirimNama: userLogin.nama,
                        pengirimRole: userLogin.role,
                        pesan,
                        waktu: "Baru saja",
                      },
                    ],
                  });
                }}
                onKirimUlasanMateri={(bintang, komentar) => {
                  if (!kelasAktif || !userLogin) return;
                  const updated: KelasItem = {
                    ...kelasAktif,
                    ulasan: [
                      {
                        id: "ul-" + Date.now(),
                        siswaNama: userLogin.nama,
                        bintang,
                        komentar,
                        waktu: "Baru saja",
                      },
                      ...(kelasAktif.ulasan || []),
                    ],
                  };
                  setKelasAktif(updated);
                  tambahXP(15);
                }}
                onBukaAuthAtauDashboard={(rolePilih) => {
                  if (rolePilih) setModeRoleAuth(rolePilih);
                  setMenuAktif("dashboard");
                }}
                konfigurasiWeb={konfigurasiWeb}
                onBukaMenuLain={(menuTujuan: string) => setMenuAktif(menuTujuan)}
              />
            )}

            {menuAktif === "simulator" && (
              <SimulatorPemrogramanView userLogin={userLogin} tambahXP={tambahXP} />
            )}

            {menuAktif === "inovasi" && (
              <FiturInovasiHubView
                userLogin={userLogin}
                poinXP={poinXP}
                materiSelesai={materiSelesai}
                rppList={rppList}
                setRppList={setRppList}
                daftarPresensi={daftarPresensi}
                setDaftarPresensi={setDaftarPresensi}
                daftarPaketTryout={daftarPaketTryout}
                tambahXP={tambahXP}
                daftarJenjang={daftarJenjang}
                kirimBroadcastNotif={kirimBroadcastNotif}
              />
            )}

            {menuAktif === "webinar" && (
              <AgendaWebinarView
                userLogin={userLogin}
                agendaList={agendaList}
                setAgendaList={setAgendaList}
                daftarTugas={daftarTugas}
                semuaModul={semuaModulFlat}
                onKirimBroadcastNotif={kirimBroadcastNotif}
                tambahXP={tambahXP}
              />
            )}

            {(menuAktif === "donasi" || menuAktif === "lapor_bug") && (
              <DonasiDanBugView
                modeHalaman={menuAktif as "donasi" | "lapor_bug"}
                userLogin={userLogin}
                konfigurasiWeb={konfigurasiWeb}
                dataDonasi={dataDonasi}
                setDataDonasi={setDataDonasi}
                daftarLaporanBug={daftarLaporanBug}
                onKirimLaporanBug={handleKirimLaporanBugKeAdmin}
                onKirimNotifDonasiKeAdmin={handleKirimNotifDonasiKeAdmin}
                tambahXP={tambahXP}
              />
            )}

            {(menuAktif === "tryout" ||
              menuAktif === "forum" ||
              menuAktif === "leaderboard") &&
              userLogin && (
                <TryoutDanForumView
                  modeMenu={menuAktif as "tryout" | "forum" | "leaderboard"}
                  userLogin={userLogin}
                  daftarAkun={daftarAkun}
                  poinXP={poinXP}
                  daftarPaketTryout={daftarPaketTryout}
                  riwayatTryout={riwayatTryout}
                  sedangUjian={sedangUjian}
                  ujianSelesai={ujianSelesai}
                  paketTryoutAktif={paketTryoutAktif}
                  sisaWaktu={sisaWaktu}
                  indeksSoalTryoutAktif={indeksSoalTryoutAktif}
                  setIndeksSoalTryoutAktif={setIndeksSoalTryoutAktif}
                  jawabanUserTryout={jawabanUserTryout}
                  setJawabanUserTryout={setJawabanUserTryout}
                  jumlahPelanggaranUjian={jumlahPelanggaranUjian}
                  pesanPeringatanCheat={pesanPeringatanCheat}
                  skorTryout={skorTryout}
                  onMulaiUjianTryout={mulaiUjianTryout}
                  onSelesaikanTryout={selesaikanTryout}
                  onResetTryout={() => {
                    setUjianSelesai(false);
                    setSedangUjian(false);
                    setPaketTryoutAktif(null);
                  }}
                  daftarDiskusi={daftarDiskusi}
                  setDaftarDiskusi={setDaftarDiskusi}
                  officeHours={officeHours}
                  setOfficeHours={setOfficeHours}
                  tambahXP={tambahXP}
                />
              )}

            {menuAktif === "dashboard" && (
              <DashboardPanelView
                userLogin={userLogin}
                setUserLogin={setUserLogin}
                daftarAkun={daftarAkun}
                setDaftarAkun={setDaftarAkun}
                daftarJenjang={daftarJenjang}
                setDaftarJenjang={setDaftarJenjang}
                daftarPaketTryout={daftarPaketTryout}
                setDaftarPaketTryout={setDaftarPaketTryout}
                riwayatTryout={riwayatTryout}
                daftarTugas={daftarTugas}
                setDaftarTugas={handleSetDaftarTugasDenganNotif}
                daftarPengumpulan={daftarPengumpulan}
                setDaftarPengumpulan={setDaftarPengumpulan}
                daftarPresensi={daftarPresensi}
                setDaftarPresensi={setDaftarPresensi}
                rppList={rppList}
                setRppList={setRppList}
                bankSoalKolektif={bankSoalKolektif}
                setBankSoalKolektif={setBankSoalKolektif}
                daftarKelompok={daftarKelompok}
                setDaftarKelompok={setDaftarKelompok}
                jadwalLive={jadwalLive}
                setJadwalLive={setJadwalLive}
                studyRooms={studyRooms}
                setStudyRooms={setStudyRooms}
                daftarBeasiswa={daftarBeasiswa}
                setDaftarBeasiswa={setDaftarBeasiswa}
                logAktivitas={logAktivitas}
                poinXP={poinXP}
                materiSelesai={materiSelesai}
                tambahXP={tambahXP}
                kirimNotifikasiKeUser={kirimNotifikasiKeUser}
                konfigurasiWeb={konfigurasiWeb}
                setKonfigurasiWeb={setKonfigurasiWeb}
                daftarLaporanBug={daftarLaporanBug}
                setDaftarLaporanBug={setDaftarLaporanBug}
                modeRoleAwalAuth={modeRoleAuth}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t py-12 text-center text-sm text-slate-500 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
          <img
            src="/hibahilmu.jpg"
            alt="Logo HibahIlmu"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-emerald-500"
          />
          <div className="font-black text-lg text-slate-800 dark:text-slate-200">
            HibahIlmu.id — Gerakan Wakaf &amp; Hibah Ilmu Pengetahuan Indonesia
          </div>
          <p className="max-w-md text-xs text-slate-500">
            Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • 100% Pendidikan Terbuka Gratis
            Selamanya.
          </p>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 pt-1">
            📞 {konfigurasiWeb.nomorKontakWa} • ✉️ {konfigurasiWeb.emailKontakResmi}
          </div>
        </div>
      </footer>
    </div>
  );
}