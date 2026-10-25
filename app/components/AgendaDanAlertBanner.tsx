"use client";

import React, { useState } from "react";
import {
  Radio,
  Calendar,
  BellRing,
  Video,
  Users,
  PlusCircle,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";
import {
  AgendaWebinarItem,
  TugasItem,
  KelasItem,
  AkunPengguna,
  PengumpulanTugas,
} from "../types";

// ============================================================================
// 1. KOMPONEN GLOBAL ALERT BANNER (MUNCUL DI ATAS HALAMAN UNTUK SEMUA ROLE)
// ============================================================================
interface SmartAlertBannerProps {
  userLogin: AkunPengguna | null;
  agendaList: AgendaWebinarItem[];
  daftarTugas: TugasItem[];
  daftarPengumpulan: PengumpulanTugas[];
  semuaModul: KelasItem[];
  onBukaMenuAgenda: () => void;
  onBukaMenuTugas: () => void;
}

export const SmartAlertBanner: React.FC<SmartAlertBannerProps> = ({
  userLogin,
  agendaList,
  daftarTugas,
  daftarPengumpulan,
  semuaModul,
  onBukaMenuAgenda,
  onBukaMenuTugas,
}) => {
  const [sembunyikanBannerAcara, setSembunyikanBannerAcara] = useState(false);
  const [sembunyikanBannerDeadline, setSembunyikanBannerDeadline] = useState(false);

  const acaraLiveSaatIni = agendaList.find((a) => a.sedangLive) || agendaList[0];

  // Cari tugas yang akan segera tutup atau aktif
  const tugasAktifTerdekat = daftarTugas[0];
  const jumlahPengumpulTugasIni = tugasAktifTerdekat
    ? daftarPengumpulan.filter((p) => p.tugasId === tugasAktifTerdekat.id).length
    : 0;
  const sudahKumpul =
    userLogin && tugasAktifTerdekat
      ? daftarPengumpulan.some(
          (p) => p.tugasId === tugasAktifTerdekat.id && p.siswaId === userLogin.id
        )
      : false;

  // Cari modul yang memiliki jadwal tutup kuis
  const modulDenganJadwalKuis = semuaModul.find((m) => m.jadwalTutupKuis);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 space-y-2.5">
      {/* ALERT 1: PENGUMUMAN ACARA / WEBINAR / LIVE STREAMING */}
      {!sembunyikanBannerAcara && acaraLiveSaatIni && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white px-5 py-3.5 shadow-lg border border-indigo-400/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1.5 animate-pulse shrink-0">
              <Radio className="w-3.5 h-3.5" />
              {acaraLiveSaatIni.sedangLive ? "LIVE STREAMING" : "AGENDA ACARA"}
            </span>
            <div className="text-xs sm:text-sm">
              <b className="text-amber-300">{acaraLiveSaatIni.kategoriAcara}:</b>{" "}
              <span className="font-bold">{acaraLiveSaatIni.judulAcara}</span>{" "}
              <span className="text-indigo-200 hidden md:inline">
                ({acaraLiveSaatIni.narasumber} • {acaraLiveSaatIni.tanggalWaktu.replace("T", " ")})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onBukaMenuAgenda}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition"
            >
              Tonton / Lihat Agenda →
            </button>
            <button
              onClick={() => setSembunyikanBannerAcara(true)}
              className="p-1 text-slate-300 hover:text-white cursor-pointer"
              title="Sembunyikan Alert Acara"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ALERT 2: PERINGATAN TUGAS / DEADLINE MAU TUTUP / SESI KUIS (UNTUK GURU & MAHASISWA) */}
      {!sembunyikanBannerDeadline && tugasAktifTerdekat && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 px-5 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm">
              {userLogin?.role === "guru" || userLogin?.role === "admin" ? (
                <>
                  <b>[Notifikasi Pengajar — Monitoring Tugas &amp; Kuis]:</b> Tugas{" "}
                  <b className="underline">&ldquo;{tugasAktifTerdekat.judul}&rdquo;</b> akan tutup
                  pada <b>{tugasAktifTerdekat.deadline}</b> ({jumlahPengumpulTugasIni} Mahasiswa
                  telah mengumpulkan).
                </>
              ) : (
                <>
                  <b>⏰ Peringatan Deadline Tugas &amp; Sesi Kuis:</b> Tugas{" "}
                  <b className="underline">&ldquo;{tugasAktifTerdekat.judul}&rdquo;</b> ditutup pada{" "}
                  <b className="text-rose-700">{tugasAktifTerdekat.deadline}</b>.{" "}
                  {sudahKumpul ? (
                    <span className="text-emerald-700 font-black">
                      (✓ Anda Sudah Mengumpulkan)
                    </span>
                  ) : (
                    <span className="text-rose-700 font-black">
                      (Segera kumpulkan sebelum sesi ditutup!)
                    </span>
                  )}
                  {modulDenganJadwalKuis && (
                    <span className="hidden lg:inline">
                      {" "}
                      • Kuis <b>{modulDenganJadwalKuis.judul}</b> aktif s/d{" "}
                      {(modulDenganJadwalKuis.jadwalTutupKuis || "").replace("T", " ")}.
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onBukaMenuTugas}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-3.5 py-1.5 rounded-xl text-xs cursor-pointer"
            >
              {userLogin?.role === "guru" ? "Cek Pengumpulan Siswa" : "Buka Tugas / Kuis"}
            </button>
            <button
              onClick={() => setSembunyikanBannerDeadline(true)}
              className="p-1 text-amber-800 hover:text-slate-950 cursor-pointer"
              title="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. HALAMAN PENUH AGENDA WEBINAR, LIVE STREAMING & BROADCAST PENGUMUMAN
// ============================================================================
interface AgendaWebinarViewProps {
  userLogin: AkunPengguna | null;
  agendaList: AgendaWebinarItem[];
  setAgendaList: React.Dispatch<React.SetStateAction<AgendaWebinarItem[]>>;
  daftarTugas: TugasItem[];
  semuaModul: KelasItem[];
  onKirimBroadcastNotif: (
    judul: string,
    pesan: string,
    tipeNotif: "tugas_deadline" | "kuis_tutup" | "webinar_live" | "info_umum"
  ) => void;
  tambahXP: (xp: number) => void;
}

export const AgendaWebinarView: React.FC<AgendaWebinarViewProps> = ({
  userLogin,
  agendaList,
  setAgendaList,
  daftarTugas,
  semuaModul,
  onKirimBroadcastNotif,
  tambahXP,
}) => {
  const [acaraStreamAktif, setAcaraStreamAktif] = useState<AgendaWebinarItem | null>(
    agendaList.find((a) => a.sedangLive) || agendaList[0] || null
  );

  // State Form Tambah Acara / Webinar Baru (Untuk Guru & Admin)
  const [judulAcaraBaru, setJudulAcaraBaru] = useState("");
  const [kategoriBaru, setKategoriBaru] = useState<AgendaWebinarItem["kategoriAcara"]>(
    "Webinar Nasional"
  );
  const [narasumberBaru, setNarasumberBaru] = useState("");
  const [tanggalWaktuBaru, setTanggalWaktuBaru] = useState("2026-10-30T19:00");
  const [platformBaru, setPlatformBaru] = useState<AgendaWebinarItem["platform"]>("YouTube Live");
  const [urlStreamBaru, setUrlStreamBaru] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [targetPesertaBaru, setTargetPesertaBaru] = useState<
    AgendaWebinarItem["targetPeserta"]
  >("Semua (Pengajar & Pelajar)");
  const [langsungLiveBaru, setLangsungLiveBaru] = useState(true);

  const bolehKelolaAcara = userLogin?.role === "admin" || userLogin?.role === "guru";

  const handleDaftarHadirWebinar = (acara: AgendaWebinarItem) => {
    if (!userLogin) {
      alert("Silakan masuk (login) terlebih dahulu untuk mendaftar kegiatan/webinar ini!");
      return;
    }
    const sudahTerdaftar = (acara.pesertaTerdaftarIds || []).includes(userLogin.id);
    if (sudahTerdaftar) {
      alert("Anda sudah terdaftar pada agenda kegiatan ini!");
      return;
    }

    setAgendaList((prev) =>
      prev.map((item) =>
        item.id === acara.id
          ? {
              ...item,
              pesertaTerdaftarIds: [...(item.pesertaTerdaftarIds || []), userLogin.id],
            }
          : item
      )
    );
    tambahXP(25);
    onKirimBroadcastNotif(
      `🎟️ Terdaftar di ${acara.kategoriAcara}`,
      `Halo ${userLogin.nama}, tiket pengingat untuk acara "${acara.judulAcara}" (${acara.tanggalWaktu.replace("T", " ")}) telah aktif!`,
      "webinar_live"
    );
    alert("✓ Berhasil mendaftar webinar! Pengingat otomatis telah ditambahkan ke kotak notifikasi Anda (+25 XP).");
  };

  return (
    <div className="space-y-10">
      {/* Header Banner Agenda & Live Streaming */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white p-8 sm:p-10 rounded-[2.2rem] shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase animate-pulse">
            <Radio className="w-4 h-4" /> Pusat Agenda, Webinar &amp; Live Streaming Pendidikan
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Siaran Langsung Kelas, Seminar Nasional &amp; Pengingat Batas Waktu Akademik
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Seluruh pengajar, siswa, dan mahasiswa mendapatkan notifikasi *real-time* setiap kali ada
            agenda webinar baru, tugas kelas yang baru dibuka, maupun tugas/kuis yang mendekati
            batas waktu penutupan (*deadline*).
          </p>
        </div>

        {bolehKelolaAcara && (
          <button
            onClick={() => {
              onKirimBroadcastNotif(
                "⏰ PENGINGAT SERENTAK: Cek Deadline Tugas & Sesi Kuis Minggu Ini!",
                "Diberitahukan kepada seluruh Pengajar dan Mahasiswa bahwa beberapa sesi Tugas & Kuis Modul akan segera ditutup. Mohon segera periksa portal masing-masing.",
                "tugas_deadline"
              );
              alert(
                "📢 Notifikasi Peringatan Deadline & Acara berhasil dikirimkan ke seluruh Pengajar dan Mahasiswa!"
              );
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shrink-0 cursor-pointer transition"
          >
            <BellRing className="w-5 h-5" /> Kirim Broadcast Peringatan Deadline ke Semua User
          </button>
        )}
      </div>

      {/* PANGGUNG UTAMA LIVE STREAMING PLAYER + MONITOR DEADLINE TUGAS/KUIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri (7 Kolom): Layar Tonton Live Streaming / Webinar */}
        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
          {acaraStreamAktif ? (
            <>
              <div className="aspect-video bg-slate-950 relative">
                {acaraStreamAktif.streamAtauJoinUrl.includes("youtube.com/embed") ? (
                  <iframe
                    src={acaraStreamAktif.streamAtauJoinUrl}
                    title={acaraStreamAktif.judulAcara}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
                    <Video className="w-16 h-16 text-indigo-400" />
                    <div className="font-black text-xl">{acaraStreamAktif.judulAcara}</div>
                    <p className="text-xs text-slate-300 max-w-md">
                      Sesi ini diselenggarakan melalui <b>{acaraStreamAktif.platform}</b>. Klik
                      tombol di bawah untuk bergabung langsung ke ruang pertemuan.
                    </p>
                    <a
                      href={acaraStreamAktif.streamAtauJoinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-xl text-xs inline-flex items-center gap-2"
                    >
                      Buka Ruang {acaraStreamAktif.platform} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    {acaraStreamAktif.sedangLive ? "Sedang Tayang (Live)" : "Jadwal Terdekat"} •{" "}
                    {acaraStreamAktif.platform}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Target: {acaraStreamAktif.targetPeserta}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {acaraStreamAktif.judulAcara}
                </h2>
                <p className="text-xs text-slate-600">
                  Narasumber: <b>{acaraStreamAktif.narasumber}</b> • Waktu:{" "}
                  <b>{acaraStreamAktif.tanggalWaktu.replace("T", " ")} WIB</b>
                </p>
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-slate-500 font-bold">
              Pilih salah satu agenda di bawah untuk menampilkan tayangan streaming.
            </div>
          )}
        </div>

        {/* Kolom Kanan (5 Kolom): Radar Peringatan Tugas & Kuis yang Akan Segera Tutup */}
        <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl p-7 border-2 border-amber-300 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                Smart Academic Radar
              </span>
              <h3 className="text-lg font-black mt-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> Radar Tugas &amp; Kuis Segera Tutup
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Daftar pengingat otomatis bagi <b>Pengajar</b> (untuk memantau &amp; menilai) dan{" "}
            <b>Mahasiswa/Siswa</b> (agar tidak terlambat mengumpulkan sebelum sesi dikunci):
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {daftarTugas.map((tgs) => (
              <div
                key={tgs.id}
                className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    {tgs.jenisTugas || "Tugas Kelas"}
                  </span>
                  <span className="font-black text-rose-700">Tutup: {tgs.deadline}</span>
                </div>
                <div className="font-black text-sm text-slate-900">{tgs.judul}</div>
                <div className="text-slate-600">Pengajar: {tgs.pembuatNama}</div>
              </div>
            ))}

            {semuaModul
              .filter((m) => m.jadwalTutupKuis)
              .map((mdl) => (
                <div
                  key={mdl.id}
                  className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black uppercase text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Sesi Kuis Modul
                    </span>
                    <span className="font-black text-indigo-900">
                      Tutup: {(mdl.jadwalTutupKuis || "").replace("T", " ")}
                    </span>
                  </div>
                  <div className="font-black text-sm text-slate-900">{mdl.judul}</div>
                  <div className="text-slate-600">
                    Syarat Kelulusan Minimal (KKM): <b>{mdl.syaratSkorMinimal || 75}/100</b>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* FORM TAMBAH JADWAL WEBINAR / STREAMING BARU (KHUSUS GURU & ADMIN) */}
      {bolehKelolaAcara && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-200 space-y-5 shadow-xs">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-xs font-black uppercase text-indigo-600">
                Panel Penyelenggara Acara (Guru &amp; Admin)
              </span>
              <h3 className="text-xl font-black flex items-center gap-2 mt-0.5">
                <PlusCircle className="w-5 h-5 text-indigo-600" /> Buat Jadwal Webinar / Live
                Streaming Baru &amp; Kirim Alert ke Semua Akun
              </h3>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!judulAcaraBaru.trim()) return;
              const acaraBaru: AgendaWebinarItem = {
                id: "web-" + Date.now(),
                judulAcara: judulAcaraBaru,
                kategoriAcara: kategoriBaru,
                narasumber: narasumberBaru || userLogin?.nama || "Tim Pengajar HibahIlmu",
                tanggalWaktu: tanggalWaktuBaru,
                platform: platformBaru,
                streamAtauJoinUrl: urlStreamBaru,
                targetPeserta: targetPesertaBaru,
                sedangLive: langsungLiveBaru,
                kuotaPeserta: 500,
                pesertaTerdaftarIds: userLogin ? [userLogin.id] : [],
              };
              setAgendaList([acaraBaru, ...agendaList]);
              setAcaraStreamAktif(acaraBaru);
              onKirimBroadcastNotif(
                `🔴 AGENDA BARU: ${acaraBaru.judulAcara}`,
                `Jangan lewatkan ${acaraBaru.kategoriAcara} bersama ${acaraBaru.narasumber} pada ${acaraBaru.tanggalWaktu.replace("T", " ")} via ${acaraBaru.platform} (${acaraBaru.targetPeserta}).`,
                "webinar_live"
              );
              setJudulAcaraBaru("");
              alert(
                "✓ Jadwal Webinar/Streaming berhasil diterbitkan dan Notifikasi Alert telah dikirim ke seluruh Pengajar & Mahasiswa!"
              );
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm"
          >
            <input
              type="text"
              required
              value={judulAcaraBaru}
              onChange={(e) => setJudulAcaraBaru(e.target.value)}
              placeholder="Judul Webinar / Live Streaming..."
              className="sm:col-span-2 p-3.5 border rounded-xl bg-slate-50 font-bold"
            />
            <select
              value={kategoriBaru}
              onChange={(e) =>
                setKategoriBaru(e.target.value as AgendaWebinarItem["kategoriAcara"])
              }
              className="p-3.5 border rounded-xl bg-indigo-50 font-black text-indigo-950"
            >
              <option value="Webinar Nasional">Webinar Nasional</option>
              <option value="Live Streaming Kelas">Live Streaming Kelas</option>
              <option value="Workshop Guru & Dosen">Workshop Guru &amp; Dosen</option>
              <option value="Tryout Akbar Nasional">Tryout Akbar Nasional</option>
            </select>

            <input
              type="text"
              value={narasumberBaru}
              onChange={(e) => setNarasumberBaru(e.target.value)}
              placeholder="Nama Pembicara / Narasumber..."
              className="p-3.5 border rounded-xl bg-slate-50"
            />
            <input
              type="datetime-local"
              value={tanggalWaktuBaru}
              onChange={(e) => setTanggalWaktuBaru(e.target.value)}
              className="p-3.5 border rounded-xl bg-slate-50 font-bold"
            />
            <select
              value={platformBaru}
              onChange={(e) => setPlatformBaru(e.target.value as AgendaWebinarItem["platform"])}
              className="p-3.5 border rounded-xl bg-slate-50 font-bold"
            >
              <option value="YouTube Live">Platform: YouTube Live (Embed)</option>
              <option value="Zoom Meeting">Platform: Zoom Meeting</option>
              <option value="Google Meet">Platform: Google Meet</option>
            </select>

            <input
              type="url"
              value={urlStreamBaru}
              onChange={(e) => setUrlStreamBaru(e.target.value)}
              placeholder="URL Embed YouTube / Link Zoom / Google Meet..."
              className="sm:col-span-2 p-3.5 border rounded-xl bg-slate-50"
            />
            <select
              value={targetPesertaBaru}
              onChange={(e) =>
                setTargetPesertaBaru(e.target.value as AgendaWebinarItem["targetPeserta"])
              }
              className="p-3.5 border rounded-xl bg-emerald-50 font-black text-emerald-950"
            >
              <option value="Semua (Pengajar & Pelajar)">Target: Semua (Pengajar &amp; Pelajar)</option>
              <option value="Khusus Pengajar">Target: Khusus Pengajar</option>
              <option value="Khusus Pelajar/Mahasiswa">Target: Khusus Pelajar/Mahasiswa</option>
            </select>

            <label className="sm:col-span-2 flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 font-black text-rose-900 cursor-pointer">
              <input
                type="checkbox"
                checked={langsungLiveBaru}
                onChange={(e) => setLangsungLiveBaru(e.target.checked)}
                className="w-4 h-4 accent-rose-600"
              />
              <span>🔴 Tandai Sedang Live Sekarang &amp; Tampilkan di Alert Banner Utama</span>
            </label>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 px-6 rounded-xl shadow-md cursor-pointer"
            >
              + Terbitkan Acara &amp; Kirim Notif
            </button>
          </form>
        </div>
      )}

      {/* DAFTAR LENGKAP AGENDA WEBINAR & KEGIATAN */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" /> Daftar Lengkap Agenda Webinar, Workshop
          &amp; Live Streaming
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agendaList.map((item) => {
            const terdaftar =
              userLogin && (item.pesertaTerdaftarIds || []).includes(userLogin.id);
            return (
              <div
                key={item.id}
                className="bg-white text-slate-800 rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        item.sedangLive
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-indigo-100 text-indigo-900"
                      }`}
                    >
                      {item.sedangLive ? "🔴 LIVE SEKARANG" : item.kategoriAcara}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{item.platform}</span>
                  </div>

                  <h4 className="font-black text-lg leading-snug text-slate-900">
                    {item.judulAcara}
                  </h4>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      🎙️ Narasumber: <b>{item.narasumber}</b>
                    </div>
                    <div>
                      🗓️ Jadwal: <b>{item.tanggalWaktu.replace("T", " ")} WIB</b>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Users className="w-3.5 h-3.5" /> {item.targetPeserta} (
                      {(item.pesertaTerdaftarIds || []).length} Terdaftar)
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setAcaraStreamAktif(item);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
                  >
                    🖥️ Tonton di Player
                  </button>

                  <button
                    onClick={() => handleDaftarHadirWebinar(item)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer ${
                      terdaftar
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {terdaftar ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terdaftar
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Daftar &amp; Ingatkan
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};