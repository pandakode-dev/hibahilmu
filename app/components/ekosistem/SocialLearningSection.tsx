"use client";

import React, { useState, useEffect } from "react";
import {
  Timer,
  Users,
  Play,
  Pause,
  RotateCcw,
  Award,
  Flame,
  Sparkles,
  CheckCircle2,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { AkunPengguna } from "../../types";

interface SocialLearningProps {
  userLogin: AkunPengguna | null;
  poinXP: number;
  tambahXP: (xp: number) => void;
}

export const SocialLearningSection: React.FC<SocialLearningProps> = ({
  userLogin,
  poinXP,
  tambahXP,
}) => {
  // 1. State Live Study With Me (Pomodoro Timer 25 Menit)
  const [detikPomodoro, setDetikPomodoro] = useState(25 * 60);
  const [sedangFokus, setSedangFokus] = useState(false);
  const [modePomodoro, setModePomodoro] = useState<"fokus" | "istirahat">("fokus");
  const [targetFokusInput, setTargetFokusInput] = useState(
    "Menyelesaikan Bab 2 Komunikasi Data & Latihan Soal Fisika"
  );
  const [pesertaRoomLive, setPesertaRoomLive] = useState([
    { nama: "Aisyah Putri", fokus: "Mekanika Klasik & Hukum Newton", durasi: "45 mnt" },
    { nama: "Dimas Anggara", fokus: "Subnetting IPv4 & Routing OSPF", durasi: "30 mnt" },
    { nama: "Rizky Pratama", fokus: "Persiapan Simulasi TPA Bappenas", durasi: "60 mnt" },
  ]);
  const [sudahGabungRoom, setSudahGabungRoom] = useState(false);

  // 2. State Mentor Sebaya (Peer Tutoring)
  const [daftarMentorSebaya, setDaftarMentorSebaya] = useState([
    {
      id: "mt-1",
      namaMentor: "Aisyah Putri",
      spesialisasi: "Fisika SMA & Olimpiade Sains",
      badge: "Certified Student Mentor",
      jadwalSesi: "Setiap Sore • 16:30 WIB",
      kuotaTersisa: 4,
      siswaTerbantu: 19,
    },
    {
      id: "mt-2",
      namaMentor: "Rizky Pratama",
      spesialisasi: "Komunikasi Data, Subnetting & Python Dasar",
      badge: "Top Peer Tutor",
      jadwalSesi: "Malam • 19:30 WIB",
      kuotaTersisa: 3,
      siswaTerbantu: 14,
    },
  ]);
  const [topikMentorBaru, setTopikMentorBaru] = useState("");
  const [jadwalMentorBaru, setJadwalMentorBaru] = useState("Sabtu, 16:00 WIB");

  // 3. State Tantangan Belajar Kolektif (Community Hackathon)
  const [daftarHackathon, setDaftarHackathon] = useState([
    {
      id: "hc-1",
      judul: "Tantangan Nasional: Tuntaskan 3 Modul Sains & Jaringan dalam 7 Hari",
      hadiahXp: 150,
      targetPeserta: 100,
      pesertaSaatIni: 84,
      diikuti: false,
      selesai: false,
    },
    {
      id: "hc-2",
      judul: "Hackathon Bank Soal: Sumbang & Diskusikan 5 Pembahasan Soal UTBK/TPA",
      hadiahXp: 200,
      targetPeserta: 50,
      pesertaSaatIni: 41,
      diikuti: false,
      selesai: false,
    },
  ]);

  useEffect(() => {
    if (!sedangFokus) return;
    const timer = setInterval(() => {
      setDetikPomodoro((prev) => {
        if (prev <= 1) {
          setSedangFokus(false);
          tambahXP(30);
          alert("🎉 Sesi Fokus Pomodoro Selesai! Anda mendapatkan bonus +30 XP.");
          return modePomodoro === "fokus" ? 25 * 60 : 5 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sedangFokus, modePomodoro]);

  const formatTimer = (totalDetik: number) => {
    const m = Math.floor(totalDetik / 60);
    const s = totalDetik % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* 1. LIVE STUDY WITH ME (VIRTUAL CO-STUDY ROOM & POMODORO) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" /> Live Study With Me • Co-Study Pomodoro
            </span>
            <span className="text-xs font-bold text-indigo-200">
              🟢 {pesertaRoomLive.length} Pelajar Sedang Fokus Bersama
            </span>
          </div>

          <div className="text-center py-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
            <div className="flex justify-center gap-2 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setSedangFokus(false);
                  setModePomodoro("fokus");
                  setDetikPomodoro(25 * 60);
                }}
                className={`px-4 py-1.5 rounded-xl cursor-pointer ${
                  modePomodoro === "fokus" ? "bg-indigo-600 text-white" : "bg-white/10"
                }`}
              >
                🍅 Fokus Belajar (25m)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSedangFokus(false);
                  setModePomodoro("istirahat");
                  setDetikPomodoro(5 * 60);
                }}
                className={`px-4 py-1.5 rounded-xl cursor-pointer ${
                  modePomodoro === "istirahat" ? "bg-emerald-600 text-white" : "bg-white/10"
                }`}
              >
                ☕ Istirahat Sejenak (5m)
              </button>
            </div>

            <div className="font-mono text-6xl sm:text-7xl font-black tracking-wider text-amber-300">
              {formatTimer(detikPomodoro)}
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto px-4">
              Target Fokus Anda: <b>&ldquo;{targetFokusInput}&rdquo;</b>
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSedangFokus(!sedangFokus)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                {sedangFokus ? (
                  <>
                    <Pause className="w-4 h-4" /> Jeda Timer
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" /> Mulai Fokus (+30 XP)
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSedangFokus(false);
                  setDetikPomodoro(modePomodoro === "fokus" ? 25 * 60 : 5 * 60);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={targetFokusInput}
              onChange={(e) => setTargetFokusInput(e.target.value)}
              placeholder="Tulis target belajar Anda di sesi ini..."
              className="flex-1 p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
            />
            {!sudahGabungRoom && (
              <button
                type="button"
                onClick={() => {
                  setPesertaRoomLive([
                    {
                      nama: userLogin?.nama || "Pelajar Tamu",
                      fokus: targetFokusInput,
                      durasi: "Baru bergabung",
                    },
                    ...pesertaRoomLive,
                  ]);
                  setSudahGabungRoom(true);
                  tambahXP(15);
                }}
                className="bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs cursor-pointer shrink-0"
              >
                + Gabung Status ke Room (+15 XP)
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Teman Belajar yang Sedang Fokus
          </h3>
          <div className="space-y-3">
            {pesertaRoomLive.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border flex justify-between items-center text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    {p.nama}
                  </div>
                  <p className="text-slate-600">Fokus: {p.fokus}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-black">
                  ⏱️ {p.durasi}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SISTEM MENTOR SEBAYA (PEER TUTORING) & 3. COMMUNITY HACKATHON CHALLENGES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Peer Tutoring &amp; Point Exchange
              </span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Program Mentor Sebaya
              </h3>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!topikMentorBaru.trim()) return;
              setDaftarMentorSebaya([
                {
                  id: "mt-" + Date.now(),
                  namaMentor: userLogin?.nama || "Mahasiswa Mentor",
                  spesialisasi: topikMentorBaru,
                  badge: "Certified Student Mentor",
                  jadwalSesi: jadwalMentorBaru,
                  kuotaTersisa: 5,
                  siswaTerbantu: 1,
                },
                ...daftarMentorSebaya,
              ]);
              setTopikMentorBaru("");
              tambahXP(50);
              alert("🎉 Anda resmi membuka klinik Mentor Sebaya dan mendapatkan lencana +50 XP!");
            }}
            className="p-4 rounded-2xl bg-slate-50 border space-y-3 text-xs"
          >
            <div className="font-black text-slate-800">
              Buka Sesi Bimbingan Sebaya (Syarat Reputasi &gt; 300 XP — XP Anda: {poinXP})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={topikMentorBaru}
                onChange={(e) => setTopikMentorBaru(e.target.value)}
                placeholder="Topik Keahlian Anda..."
                className="p-2.5 border rounded-xl bg-white font-bold"
              />
              <input
                type="text"
                value={jadwalMentorBaru}
                onChange={(e) => setJadwalMentorBaru(e.target.value)}
                placeholder="Jadwal Sesi..."
                className="p-2.5 border rounded-xl bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Daftar Jadi Mentor Sebaya (+50 XP)
            </button>
          </form>

          <div className="space-y-3">
            {daftarMentorSebaya.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl border bg-white flex flex-wrap justify-between items-center gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{m.namaMentor}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px]">
                      ★ {m.badge}
                    </span>
                  </div>
                  <div className="font-bold text-indigo-700">{m.spesialisasi}</div>
                  <div className="text-slate-500">
                    {m.jadwalSesi} • {m.siswaTerbantu} Teman Terbantu
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDaftarMentorSebaya(
                      daftarMentorSebaya.map((x) =>
                        x.id === m.id ? { ...x, siswaTerbantu: x.siswaTerbantu + 1 } : x
                      )
                    );
                    tambahXP(20);
                    alert(`✓ Anda bergabung ke sesi bimbingan sebaya bersama ${m.namaMentor}!`);
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black cursor-pointer"
                >
                  Ikut Belajar (+20 XP)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Community Challenges / Hackathon Belajar */}
        <div className="lg:col-span-6 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
              Community Hackathon &amp; Weekly Sprint
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" /> Tantangan Belajar Kolektif Nasional
            </h3>
          </div>

          <div className="space-y-4">
            {daftarHackathon.map((hc) => {
              const persen = Math.min(
                100,
                Math.round((hc.pesertaSaatIni / hc.targetPeserta) * 100)
              );
              return (
                <div
                  key={hc.id}
                  className="p-5 rounded-2xl bg-slate-50 border space-y-3 text-xs sm:text-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black text-slate-900">{hc.judul}</h4>
                    <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shrink-0">
                      +{hc.hadiahXp} XP
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Progres Partisipasi Kolektif:</span>
                      <span>
                        {hc.pesertaSaatIni}/{hc.targetPeserta} Pelajar ({persen}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${persen}%` }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {hc.selesai ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Tantangan Tuntas &amp; XP Diklaim
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDaftarHackathon(
                            daftarHackathon.map((x) =>
                              x.id === hc.id
                                ? {
                                    ...x,
                                    pesertaSaatIni: x.pesertaSaatIni + 1,
                                    selesai: true,
                                  }
                                : x
                            )
                          );
                          tambahXP(hc.hadiahXp);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ikuti &amp; Klaim Misi (+
                        {hc.hadiahXp} XP)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};