"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Gift,
  WifiOff,
  Download,
  BellRing,
  CheckCircle2,
  Sparkles,
  Flame,
  Send,
  BookOpen,
  Trash2,
} from "lucide-react";
import { JenjangItem, KelasItem, AkunPengguna } from "../../types";
import { bersihkanTagHtml } from "../../mockData";

interface KarierDanOfflineProps {
  userLogin: AkunPengguna | null;
  daftarJenjang: JenjangItem[];
  materiSelesai: string[];
  tambahXP: (xp: number) => void;
  kirimBroadcastNotif: (
    judul: string,
    pesan: string,
    tipeNotif?: "tugas_deadline" | "kuis_tutup" | "webinar_live" | "info_umum"
  ) => void;
}

export const KarierDanOfflineSection: React.FC<KarierDanOfflineProps> = ({
  userLogin,
  daftarJenjang,
  materiSelesai,
  tambahXP,
  kirimBroadcastNotif,
}) => {
  const semuaModul: KelasItem[] = daftarJenjang.flatMap((j) => j.kelas);

  // 1. Data Pohon Karier & Jalur Belajar (Career Learning Path)
  const daftarJalurKarier = [
    {
      id: "path-net",
      namaKarier: "Network & Cloud Infrastructure Engineer (Cisco NetAcad Track)",
      targetRole: "Network Engineer / DevOps",
      modulIds: ["materi-komdat-1", "materi-komdat-2"],
      warna: "from-indigo-600 to-blue-700",
    },
    {
      id: "path-ai",
      namaKarier: "Big Data Architect & AI Reinforcement Learning Scientist",
      targetRole: "Data Engineer / AI Researcher",
      modulIds: ["materi-komdat-1", "materi-pt-1"],
      warna: "from-purple-600 to-indigo-800",
    },
    {
      id: "path-sains",
      namaKarier: "Pejuang Olimpiade Fisika & Sains Terapan (SNBT / UTBK)",
      targetRole: "Medali OSN & Lulusan PTN Favorit",
      modulIds: ["materi-sma-1", "materi-sma-2"],
      warna: "from-emerald-600 to-teal-700",
    },
  ];

  // 2. State Peti Harta Karun XP (Mystery Box & Daily Streak)
  const [hariStreak, setHariStreak] = useState<number>(5);
  const [sudahBukaPetiHariIni, setSudahBukaPetiHariIni] = useState<boolean>(false);
  const [hadiahPetiTerakhir, setHadiahPetiTerakhir] = useState<{
    xp: number;
    item: string;
  } | null>(null);

  // 3. State Mode Offline Terbatas (Simpan ke localStorage & Unduh Paket HTML Offline)
  const [modulOfflineTersimpan, setModulOfflineTersimpan] = useState<KelasItem[]>([]);

  // 4. State Integrasi Bot Pengingat Pintar (WhatsApp & Telegram Bridge)
  const [nomorWaBot, setNomorWaBot] = useState("0812-3456-7890");
  const [usernameTeleBot, setUsernameTeleBot] = useState("@pelajar_hibahilmu");
  const [botAktif, setBotAktif] = useState<{ wa: boolean; tele: boolean }>({
    wa: true,
    tele: true,
  });
  const [logPesanBot, setLogPesanBot] = useState<
    { id: string; kanal: string; pesan: string; waktu: string }[]
  >([
    {
      id: "bot-1",
      kanal: "WhatsApp Bot",
      pesan:
        "⏰ [HibahIlmu Bot]: Halo! Jangan lupa Tugas Perancangan Subnetting IPv4 akan ditutup besok pukul 23:59 WIB.",
      waktu: "10 menit lalu",
    },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hibahilmu_offline_modules");
      if (saved) {
        setModulOfflineTersimpan(JSON.parse(saved));
      } else if (semuaModul.length > 0) {
        setModulOfflineTersimpan([semuaModul[0]]);
      }
    } catch {}
  }, []);

  const handleBukaPetiMysteryBox = () => {
    if (sudahBukaPetiHariIni) return;
    const daftarHadiah = [
      { xp: 50, item: "Lencana Penjelajah Rajin + Booster Fokus" },
      { xp: 75, item: "Kartu Pelindung Streak 7 Hari + Bintang Emas" },
      { xp: 100, item: "Jackpot Cendekiawan Wakaf Ilmu!" },
    ];
    const acak = daftarHadiah[Math.floor(Math.random() * daftarHadiah.length)];
    setHadiahPetiTerakhir(acak);
    setSudahBukaPetiHariIni(true);
    setHariStreak((prev) => prev + 1);
    tambahXP(acak.xp);
  };

  const simpanModulKeOfflineLokal = (mdl: KelasItem) => {
    const sudahAda = modulOfflineTersimpan.some((x) => x.id === mdl.id);
    if (sudahAda) {
      alert("Modul ini sudah tersimpan di memori Offline perangkat Anda.");
      return;
    }
    const baru = [mdl, ...modulOfflineTersimpan];
    setModulOfflineTersimpan(baru);
    try {
      localStorage.setItem("hibahilmu_offline_modules", JSON.stringify(baru));
    } catch {}
    tambahXP(15);
    alert(`✓ Modul "${mdl.judul}" berhasil disimpan ke Mode Offline perangkat (+15 XP)!`);
  };

  const unduhFileHtmlOffline = (mdl: KelasItem) => {
    const isiHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Paket Belajar Offline - ${mdl.judul}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1e293b; }
  .box { background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .badge { background: #059669; color: white; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; }
</style>
</head>
<body>
  <span class="badge">PAKET BELAJAR OFFLINE HIBAHILMU.ID</span>
  <h1>${mdl.judul}</h1>
  <p><b>Pengajar:</b> ${mdl.pembuatNama} | <b>Level:</b> ${mdl.level} | <b>Syarat KKM:</b> ${
      mdl.syaratSkorMinimal || 75
    }/100</p>
  <div class="box">
    <h3>📖 Rangkuman Materi Utama</h3>
    ${mdl.rangkuman}
  </div>
  <div class="box">
    <h3>🧠 Daftar Kartu Hafalan (Flashcards)</h3>
    <ul>
      ${(mdl.flashcards || [])
        .map((f) => `<li><b>${f.depan}:</b> ${f.belakang}</li>`)
        .join("")}
    </ul>
  </div>
  <p style="font-size:12px;color:#64748b;">Diunduh dari Platform Wakaf Pendidikan Gratis HibahIlmu.id</p>
</body>
</html>`;

    const blob = new Blob([isiHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Materi_Offline_${mdl.judul.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* KATEGORI 3: POHON KARIER (CAREER LEARNING PATH) & PETI HARTA KARUN XP HARIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pohon Karier & Jalur Belajar */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
              Career Learning Path &amp; Roadmap
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" /> Pohon Karier &amp; Jalur Belajar
              Terstruktur
            </h3>
          </div>

          <div className="space-y-4">
            {daftarJalurKarier.map((jalur) => {
              const selesaiCount = jalur.modulIds.filter((id) =>
                materiSelesai.includes(id)
              ).length;
              const persen = Math.round(
                (selesaiCount / (jalur.modulIds.length || 1)) * 100
              );

              return (
                <div
                  key={jalur.id}
                  className="p-5 rounded-2xl bg-slate-50 border space-y-3 text-xs sm:text-sm"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-600">
                        Target Profesi: {jalur.targetRole}
                      </span>
                      <h4 className="font-black text-base text-slate-900">
                        {jalur.namaKarier}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                      {persen}% Tuntas ({selesaiCount}/{jalur.modulIds.length} Modul)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${persen}%` }}
                      className={`h-full bg-gradient-to-r ${jalur.warna} rounded-full`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {jalur.modulIds.map((mId, idx) => {
                      const mdl = semuaModul.find((x) => x.id === mId);
                      const lulus = materiSelesai.includes(mId);
                      return (
                        <span
                          key={mId}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                            lulus
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {lulus ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-black">
                              {idx + 1}
                            </span>
                          )}
                          <span>{mdl?.judul || mId}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peti Harta Karun XP (Daily Streak & Mystery Box) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="bg-black/25 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-300" /> Daily Login Streak:{" "}
                {hariStreak} Hari Beruntun
              </span>
            </div>
            <h3 className="text-2xl font-black pt-1 flex items-center gap-2">
              <Gift className="w-7 h-7" /> Peti Harta Karun XP (Mystery Box Harian)
            </h3>
            <p className="text-xs text-white/90 leading-relaxed">
              Pertahankan konsistensi belajar setiap hari! Buka peti harta karun harian untuk
              memperoleh bonus XP acak dan lencana eksklusif.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/15 border border-white/25 backdrop-blur-md text-center space-y-4">
            <div className="text-5xl animate-bounce">🎁</div>
            {hadiahPetiTerakhir ? (
              <div className="space-y-1">
                <div className="text-xs font-black uppercase text-amber-200">
                  SELAMAT! ANDA MENDAPATKAN:
                </div>
                <div className="text-2xl font-black">+{hadiahPetiTerakhir.xp} XP</div>
                <div className="text-xs font-bold">{hadiahPetiTerakhir.item}</div>
              </div>
            ) : (
              <div className="text-sm font-black">
                Peti Hadiah Hari Ke-{hariStreak + 1} Siap Dibuka!
              </div>
            )}

            <button
              type="button"
              disabled={sudahBukaPetiHariIni}
              onClick={handleBukaPetiMysteryBox}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-amber-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              {sudahBukaPetiHariIni
                ? "✓ Peti Hari Ini Sudah Diklaim"
                : "Buka Peti Harta Karun Sekarang!"}
            </button>
          </div>
        </div>
      </div>

      {/* KATEGORI 4: MODE OFFLINE TERBATAS & BOT PENGINGAT WHATSAPP / TELEGRAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mode Offline Terbatas (Simpan Rangkuman & Unduh HTML Offline) */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Offline-First Learning Sync
              </span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-emerald-600" /> Mode Belajar Offline &amp; Unduh
                Paket Materi Mandiri
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Simpan rangkuman modul dan kartu hafalan ke penyimpanan lokal browser atau unduh sebagai
            file mandiri (`.html`) agar tetap bisa dibaca tanpa kuota internet:
          </p>

          <div className="flex flex-wrap gap-2">
            {semuaModul.slice(0, 4).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => simpanModulKeOfflineLokal(m)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-800 text-xs font-bold border cursor-pointer"
              >
                + Simpan Offline: {m.judul.slice(0, 32)}...
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <div className="text-xs font-black uppercase text-slate-400">
              Pustaka Materi Tersimpan di Perangkat Anda ({modulOfflineTersimpan.length} Modul):
            </div>
            {modulOfflineTersimpan.map((mdl) => (
              <div
                key={mdl.id}
                className="p-4 rounded-2xl bg-slate-50 border flex flex-wrap justify-between items-center gap-3 text-xs"
              >
                <div className="space-y-1 max-w-md">
                  <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{mdl.judul}</span>
                  </div>
                  <p className="text-slate-500 line-clamp-1">
                    {bersihkanTagHtml(mdl.rangkuman)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => unduhFileHtmlOffline(mdl)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh File Offline (.HTML)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sisa = modulOfflineTersimpan.filter((x) => x.id !== mdl.id);
                      setModulOfflineTersimpan(sisa);
                      try {
                        localStorage.setItem(
                          "hibahilmu_offline_modules",
                          JSON.stringify(sisa)
                        );
                      } catch {}
                    }}
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrasi Bot Pengingat Pintar (WhatsApp & Telegram Notification Bridge) */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950">
              WA &amp; Telegram Bot Bridge
            </span>
            <h3 className="text-xl font-black mt-1.5 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-emerald-400" /> Integrasi Bot Pengingat Pintar
              (WhatsApp &amp; Telegram)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Terima notifikasi otomatis langsung ke WhatsApp atau Telegram Anda saat ada tugas yang
              hampir tutup (*deadline*) atau jadwal webinar dimulai.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Nomor WhatsApp Terhubung:
              </label>
              <input
                type="text"
                value={nomorWaBot}
                onChange={(e) => setNomorWaBot(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                Username Telegram (@):
              </label>
              <input
                type="text"
                value={usernameTeleBot}
                onChange={(e) => setUsernameTeleBot(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={botAktif.wa}
                  onChange={(e) => setBotAktif({ ...botAktif, wa: e.target.checked })}
                  className="accent-emerald-500"
                />
                <span>Aktifkan Bot WA</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={botAktif.tele}
                  onChange={(e) => setBotAktif({ ...botAktif, tele: e.target.checked })}
                  className="accent-emerald-500"
                />
                <span>Aktifkan Bot Telegram</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                const pesanSimulasi = `🔔 [Test Push Bot ke ${nomorWaBot} & ${usernameTeleBot}]: Pengingat aktif! Anda memiliki 1 Tugas Modul & Sesi Webinar minggu ini.`;
                setLogPesanBot([
                  {
                    id: "bot-" + Date.now(),
                    kanal: "WA & Telegram Bridge",
                    pesan: pesanSimulasi,
                    waktu: "Baru saja",
                  },
                  ...logPesanBot,
                ]);
                kirimBroadcastNotif(
                  "🤖 Bot WA & Telegram Terhubung",
                  pesanSimulasi,
                  "tugas_deadline"
                );
                tambahXP(20);
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Send className="w-4 h-4" /> Uji Kirim Notifikasi WA &amp; Telegram (+20 XP)
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 max-h-40 overflow-y-auto">
            {logPesanBot.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-0.5"
              >
                <div className="flex justify-between font-black text-emerald-400">
                  <span>{log.kanal}</span>
                  <span className="text-slate-400">{log.waktu}</span>
                </div>
                <p className="text-slate-200">{log.pesan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};