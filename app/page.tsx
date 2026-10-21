"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Bell,
  LayoutDashboard,
  Sun,
  Moon,
  Type,
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
  STUDY_ROOMS_AWAL,
  BEASISWA_AWAL,
  RPP_REPOSITORY_AWAL,
  OFFICE_HOURS_AWAL,
  DISKUSI_PR_AWAL,
} from "./mockData";

import { RuangBelajarView } from "./components/RuangBelajarView";
import { TryoutDanForumView } from "./components/TryoutDanForumView";
import { DashboardPanelView } from "./components/DashboardPanelView";

export default function AplikasiHibahIlmu() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ukuranTeksBesar, setUkuranTeksBesar] = useState<boolean>(false);
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

  const [daftarTugas, setDaftarTugas] = useState<TugasItem[]>(TUGAS_AWAL);
  const [daftarPengumpulan, setDaftarPengumpulan] =
    useState<PengumpulanTugas[]>(PENGUMPULAN_AWAL);
  const [daftarPresensi, setDaftarPresensi] = useState<PresensiItem[]>([]);
  const [rppList, setRppList] = useState<RppItem[]>(RPP_REPOSITORY_AWAL);
  const [officeHours, setOfficeHours] = useState<OfficeHourItem[]>(OFFICE_HOURS_AWAL);
  const [bankSoalKolektif, setBankSoalKolektif] =
    useState<SoalTryout[]>(BANK_SOAL_KOLEKTIF_AWAL);
  const [jadwalLive, setJadwalLive] = useState<JadwalLiveItem[]>(JADWAL_LIVE_AWAL);
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

  // State Tryout CBT Proctoring
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

  // Sensor Anti-Cheat CBT (Alt+Tab & Fullscreen)
  useEffect(() => {
    if (!sedangUjian || !paketTryoutAktif) return;
    const catatPelanggaran = (alasan: string) => {
      setJumlahPelanggaranUjian((prev) => {
        const total = prev + 1;
        const batas = paketTryoutAktif.batasPelanggaran || 3;
        setPesanPeringatanCheat(
          `PERINGATAN PELANGGARAN (${total}/${batas}): Terdeteksi ${alasan}!`
        );
        if (total >= batas) selesaikanTryout();
        return total;
      });
    };
    const onVis = () => {
      if (document.hidden) catatPelanggaran("pindah tab browser");
    };
    const onBlur = () => catatPelanggaran("menekan Alt+Tab");
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
    };
  }, [sedangUjian, paketTryoutAktif]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sedangUjian && !ujianSelesai && sisaWaktu > 0) {
      timer = setInterval(() => setSisaWaktu((p) => p - 1), 1000);
    } else if (sisaWaktu === 0 && sedangUjian) {
      selesaikanTryout();
    }
    return () => clearInterval(timer);
  }, [sedangUjian, ujianSelesai, sisaWaktu]);

  // Presensi Otomatis Saat Membuka Materi
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

  const selesaikanTryout = () => {
    if (!paketTryoutAktif || !userLogin) return;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    let benar = 0;
    paketTryoutAktif.daftarSoal.forEach((s, idx) => {
      if (jawabanUserTryout[idx] === s.jawabanBenar) benar++;
    });
    const nilai = Math.round((benar / (paketTryoutAktif.daftarSoal.length || 1)) * 100);
    setSkorTryout(nilai);
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
        jumlahPelanggaran: jumlahPelanggaranUjian,
        waktuSelesai: "Baru saja",
        statusAkhir: "Selesai Normal",
      },
      ...prev,
    ]);
    if (benar > 0) tambahXP(benar * 40);
  };

  const notifikasiUserAktif = daftarNotifikasi.filter((n) =>
    userLogin ? n.targetUserId === userLogin.id || n.targetUserId === "ALL" : false
  );

  return (
    <div
      className={`min-h-screen font-sans antialiased relative overflow-x-hidden transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-800"
      } ${ukuranTeksBesar ? "text-lg leading-relaxed" : "text-base leading-normal"}`}
    >
      {/* HEADER NAVBAR DENGAN LOGO HIBAHILMU.JPG */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-xs ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200/80"
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
                Wakaf &amp; Hibah Ilmu Gratis
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "beranda", label: "Beranda & Skill Tree" },
              { id: "tryout", label: "Tryout CBT & QR" },
              { id: "leaderboard", label: "Leaderboard XP" },
              { id: "forum", label: "Forum & Tanya Ahli" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMenuAktif(tab.id);
                  setJenjangAktif(null);
                  setKelasAktif(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-extrabold transition whitespace-nowrap cursor-pointer ${
                  menuAktif === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : darkMode
                    ? "text-slate-200 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 relative">
            <button
              onClick={() => setUkuranTeksBesar(!ukuranTeksBesar)}
              className="p-2.5 rounded-xl border text-sm font-black"
              title="Perbesar Ukuran Font"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border"
              title="Mode Gelap / Terang"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-sm font-black">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{poinXP} XP</span>
            </div>

            {userLogin && (
              <div className="relative">
                <button
                  onClick={() => setBukaMenuNotif(!bukaMenuNotif)}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-700 relative"
                >
                  <Bell className="w-4 h-4" />
                </button>
                {bukaMenuNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-3xl shadow-2xl border p-4 z-50">
                    <div className="font-black text-sm border-b pb-2 mb-2">Kotak Notifikasi</div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifikasiUserAktif.map((n) => (
                        <div key={n.id} className="p-3 rounded-xl border text-xs bg-slate-50">
                          <div className="font-black">{n.judul}</div>
                          <p className="text-slate-600">{n.pesan}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setMenuAktif("dashboard");
                setJenjangAktif(null);
                setKelasAktif(null);
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{userLogin ? `Panel ${userLogin.role}` : "Masuk / Daftar"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-10">
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
          />
        )}

        {(menuAktif === "tryout" || menuAktif === "forum" || menuAktif === "leaderboard") &&
          (!userLogin ? (
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
              setDaftarTugas={setDaftarTugas}
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
              modeRoleAwalAuth={modeRoleAuth}
            />
          ) : (
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
          ))}

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
            setDaftarTugas={setDaftarTugas}
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
            modeRoleAwalAuth={modeRoleAuth}
          />
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
            Dibangun dengan dedikasi oleh <strong>Panda Kode</strong> • Arsitektur Modular Multi-File
            Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}