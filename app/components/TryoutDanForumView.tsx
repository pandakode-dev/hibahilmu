"use client";

import React, { useState } from "react";
import {
  Timer,
  ShieldAlert,
  Trophy,
  MessageSquare,
  QrCode,
  Play,
  RotateCcw,
  Crown,
  HeartHandshake,
  Video,
  PlusCircle,
  Lock,
  Edit3,
  Keyboard,
  Calendar,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  PaketTryout,
  AkunPengguna,
  RiwayatPercobaanTryout,
  DiskusiPR,
  OfficeHourItem,
} from "../types";
import { DATA_TRANSPARANSI_DONASI } from "../mockData";
import { CbtUjianLanjutanModal } from "./CbtUjianLanjutanModal";

interface TryoutForumProps {
  modeMenu: "tryout" | "forum" | "leaderboard";
  userLogin: AkunPengguna;
  daftarAkun: AkunPengguna[];
  poinXP: number;
  daftarPaketTryout: PaketTryout[];
  riwayatTryout: RiwayatPercobaanTryout[];
  sedangUjian: boolean;
  ujianSelesai: boolean;
  paketTryoutAktif: PaketTryout | null;
  sisaWaktu: number;
  indeksSoalTryoutAktif: number;
  setIndeksSoalTryoutAktif: (i: number) => void;
  jawabanUserTryout: { [key: number]: number };
  setJawabanUserTryout: (j: { [key: number]: number }) => void;
  jumlahPelanggaranUjian: number;
  pesanPeringatanCheat: string;
  skorTryout: number;
  onMulaiUjianTryout: (pkt: PaketTryout) => void;
  onSelesaikanTryout: (
    skorManual?: number,
    pelanggaranManual?: number,
    statusManual?: "Selesai Normal" | "Diskualifikasi (Auto-Submit)"
  ) => void;
  onResetTryout: () => void;
  daftarDiskusi: DiskusiPR[];
  setDaftarDiskusi: (list: DiskusiPR[]) => void;
  officeHours: OfficeHourItem[];
  setOfficeHours: (list: OfficeHourItem[]) => void;
  tambahXP: (xp: number) => void;
}

export const TryoutDanForumView: React.FC<TryoutForumProps> = ({
  modeMenu,
  userLogin,
  daftarAkun,
  poinXP,
  daftarPaketTryout,
  riwayatTryout,
  sedangUjian,
  ujianSelesai,
  paketTryoutAktif,
  skorTryout,
  onMulaiUjianTryout,
  onSelesaikanTryout,
  onResetTryout,
  daftarDiskusi,
  setDaftarDiskusi,
  officeHours,
  setOfficeHours,
  tambahXP,
}) => {
  const [paketKartuQr, setPaketKartuQr] = useState<PaketTryout | null>(null);
  const [judulDiskusiBaru, setJudulDiskusiBaru] = useState("");
  const [isiDiskusiBaru, setIsiDiskusiBaru] = useState("");
  const [inputJawabanForum, setInputJawabanForum] = useState<{ [diskusiId: string]: string }>({});

  // State Booking Slot 1-on-1 Office Hours
  const [inputTanyaOh, setInputTanyaOh] = useState<{ [id: string]: string }>({});
  const [slotJamPilih, setSlotJamPilih] = useState<{ [id: string]: string }>({});

  // State Papan Peringkat Mingguan (Weekly Leaderboard Reset)
  const [modePeringkat, setModePeringkat] = useState<"all_time" | "mingguan">("all_time");
  const [sudahResetMingguan, setSudahResetMingguan] = useState(false);

  const cekStatusSesiUjian = (pkt: PaketTryout) => {
    const now = new Date().getTime();
    const buka = pkt.jadwalBukaSesi ? new Date(pkt.jadwalBukaSesi).getTime() : 0;
    const tutup = pkt.jadwalTutupSesi
      ? new Date(pkt.jadwalTutupSesi).getTime()
      : Number.MAX_SAFE_INTEGER;
    if (buka && now < buka) return { terbuka: false, label: "Sesi Belum Dibuka" };
    if (tutup && now > tutup) return { terbuka: false, label: "Sesi Sudah Ditutup" };
    return { terbuka: true, label: "Sesi Terbuka" };
  };

  // ============================================================================
  // 1. TAMPILAN LEADERBOARD XP (ALL-TIME & WEEKLY RESET) + TRANSPARANSI WAKAF
  // ============================================================================
  if (modeMenu === "leaderboard") {
    const peringkat = [...daftarAkun]
      .map((a) => {
        const xpAllTime = a.id === userLogin.id ? poinXP : a.xp || 300;
        const xpMingguIni = sudahResetMingguan
          ? a.id === userLogin.id
            ? 120
            : 80
          : Math.round(xpAllTime * 0.35);
        return {
          ...a,
          totalXp: modePeringkat === "all_time" ? xpAllTime : xpMingguIni,
        };
      })
      .sort((a, b) => b.totalXp - a.totalXp);

    return (
      <div className="space-y-10">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-8 rounded-[2.2rem] shadow-xl flex flex-wrap justify-between items-center gap-6">
          <div>
            <span className="bg-black/20 text-xs font-black px-3 py-1 rounded-full uppercase">
              National EdTech Gamification • Weekly &amp; All-Time
            </span>
            <h1 className="text-3xl font-black mt-2 flex items-center gap-2">
              <Crown className="w-8 h-8" /> Papan Peringkat Reputasi (Leaderboard XP)
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/20 p-1.5 rounded-2xl flex gap-1 text-xs font-black">
              <button
                onClick={() => setModePeringkat("all_time")}
                className={`px-4 py-2 rounded-xl cursor-pointer ${
                  modePeringkat === "all_time" ? "bg-white text-slate-900" : "text-white"
                }`}
              >
                Sepanjang Masa (All-Time)
              </button>
              <button
                onClick={() => setModePeringkat("mingguan")}
                className={`px-4 py-2 rounded-xl cursor-pointer ${
                  modePeringkat === "mingguan" ? "bg-white text-slate-900" : "text-white"
                }`}
              >
                🔥 Kompetisi Mingguan
              </button>
            </div>

            {modePeringkat === "mingguan" && (
              <button
                onClick={() => {
                  setSudahResetMingguan(true);
                  alert("🔄 Siklus Poin Mingguan berhasil di-reset untuk pekan kompetisi baru!");
                }}
                className="bg-slate-950/80 hover:bg-slate-900 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Simulasikan Reset Mingguan
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">
                {modePeringkat === "all_time"
                  ? "Top Kontributor & Pelajar Sepanjang Masa"
                  : "🔥 Klasemen XP Minggu Ini (Reset Setiap Senin)"}
              </h3>
            </div>
            {peringkat.map((u, idx) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl border bg-slate-50 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                      idx === 0
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-black text-base">{u.nama}</div>
                    <div className="text-xs text-slate-500 uppercase font-bold">{u.role}</div>
                  </div>
                </div>
                <span className="font-black text-amber-600">{u.totalXp} XP</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" /> Transparansi Wakaf Ilmu 100%
              Gratis
            </h3>
            <p className="text-xs text-slate-500">
              Platform ini 100% gratis untuk seluruh pelajar. Operasional server didukung oleh
              wakaf masyarakat:
            </p>
            {DATA_TRANSPARANSI_DONASI.alokasiPenggunaan.map((al, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold">
                  <span>{al.kategori}</span>
                  <span>{al.persentase}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${al.persentase}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. TAMPILAN FORUM PR (BEST ANSWER UPVOTE +50 XP) & BOOKING 1-ON-1 OFFICE HOURS
  // ============================================================================
  if (modeMenu === "forum") {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Forum PR dengan Best Answer Validation */}
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
            <div>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                Peer-to-Peer Q&amp;A + Best Answer Verification
              </span>
              <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-600" /> Forum Tanya Jawab PR &amp;
                Validasi Jawaban Terbaik
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!judulDiskusiBaru.trim()) return;
                setDaftarDiskusi([
                  {
                    id: "pr-" + Date.now(),
                    penanya: userLogin.nama,
                    jenjang: "Umum",
                    mapel: "Sains & IT",
                    judul: judulDiskusiBaru,
                    pertanyaan: isiDiskusiBaru,
                    waktu: "Baru saja",
                    likes: 1,
                    solved: false,
                    jawaban: [],
                  },
                  ...daftarDiskusi,
                ]);
                setJudulDiskusiBaru("");
                setIsiDiskusiBaru("");
                tambahXP(20);
              }}
              className="p-5 bg-slate-50 rounded-2xl border space-y-3 text-sm"
            >
              <input
                type="text"
                required
                value={judulDiskusiBaru}
                onChange={(e) => setJudulDiskusiBaru(e.target.value)}
                placeholder="Judul pertanyaan PR atau konsep yang belum dipahami..."
                className="w-full p-3 border rounded-xl bg-white font-bold"
              />
              <textarea
                rows={2}
                required
                value={isiDiskusiBaru}
                onChange={(e) => setIsiDiskusiBaru(e.target.value)}
                placeholder="Detail soal atau kendala Anda..."
                className="w-full p-3 border rounded-xl bg-white"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
              </button>
            </form>

            <div className="space-y-5">
              {daftarDiskusi.map((d) => (
                <div
                  key={d.id}
                  className="p-6 border-2 border-slate-200 rounded-3xl bg-white space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600">
                      {d.mapel} • Oleh <b>{d.penanya}</b> ({d.waktu})
                    </span>
                    {d.solved && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terjawab (Solved)
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-lg text-slate-900">{d.judul}</h4>
                    <p className="text-sm text-slate-600 mt-1">{d.pertanyaan}</p>
                  </div>

                  {/* Daftar Jawaban & Tombol Tandai Best Answer */}
                  <div className="space-y-2.5 pl-4 border-l-2 border-indigo-200">
                    {d.jawaban.map((jwb) => (
                      <div
                        key={jwb.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                          jwb.isBestAnswer
                            ? "bg-emerald-50 border-emerald-400"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <span className="font-black text-slate-900">
                            {jwb.penjawab} ({jwb.rolePenjawab})
                          </span>
                          <div className="flex items-center gap-2">
                            {jwb.isBestAnswer && (
                              <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">
                                ★ JAWABAN TERBAIK (+50 XP)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setDaftarDiskusi(
                                  daftarDiskusi.map((item) =>
                                    item.id === d.id
                                      ? {
                                          ...item,
                                          jawaban: item.jawaban.map((x) =>
                                            x.id === jwb.id
                                              ? { ...x, upvotes: x.upvotes + 1 }
                                              : x
                                          ),
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white border font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3 text-indigo-600" /> {jwb.upvotes}
                            </button>

                            {!jwb.isBestAnswer && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDaftarDiskusi(
                                    daftarDiskusi.map((item) =>
                                      item.id === d.id
                                        ? {
                                            ...item,
                                            solved: true,
                                            jawaban: item.jawaban.map((x) => ({
                                              ...x,
                                              isBestAnswer: x.id === jwb.id,
                                            })),
                                          }
                                        : item
                                    )
                                  );
                                  tambahXP(50);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black cursor-pointer"
                              >
                                ★ Tandai Jawaban Terbaik
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700">{jwb.isi}</p>
                      </div>
                    ))}
                  </div>

                  {/* Form Tambah Jawaban */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={inputJawabanForum[d.id] || ""}
                      onChange={(e) =>
                        setInputJawabanForum({ ...inputJawabanForum, [d.id]: e.target.value })
                      }
                      placeholder="Bantu jawab pertanyaan teman Anda (+25 XP)..."
                      className="flex-1 p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const isi = (inputJawabanForum[d.id] || "").trim();
                        if (!isi) return;
                        setDaftarDiskusi(
                          daftarDiskusi.map((item) =>
                            item.id === d.id
                              ? {
                                  ...item,
                                  jawaban: [
                                    ...item.jawaban,
                                    {
                                      id: "jwb-" + Date.now(),
                                      penjawab: userLogin.nama,
                                      rolePenjawab: userLogin.role,
                                      isi,
                                      waktu: "Baru saja",
                                      upvotes: 1,
                                    },
                                  ],
                                }
                              : item
                          )
                        );
                        setInputJawabanForum({ ...inputJawabanForum, [d.id]: "" });
                        tambahXP(25);
                      }}
                      className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                    >
                      Jawab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Booking Slot Konsultasi Privat 1-on-1 (Office Hours) */}
          <div className="lg:col-span-5 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                1-on-1 Mentorship Booking
              </span>
              <h3 className="text-xl font-black mt-2 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" /> Booking Slot Konsultasi Pakar
                (Office Hours)
              </h3>
            </div>

            {officeHours.map((oh) => (
              <div key={oh.id} className="p-5 rounded-2xl bg-slate-50 border space-y-3 text-xs">
                <div className="font-black text-base text-slate-900">{oh.topikBahasan}</div>
                <div className="text-slate-600">
                  Narasumber: <b>{oh.namaAhli}</b> • {oh.jadwalHariJam}
                </div>

                {/* Daftar Antrean Slot 1-on-1 */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-black text-[11px] uppercase text-slate-400">
                    Slot Konsultasi Terpesan ({oh.antreanPertanyaan.length}):
                  </div>
                  {oh.antreanPertanyaan.map((ant, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border flex justify-between items-center"
                    >
                      <span>
                        <b>{ant.namaSiswa}:</b> {ant.pertanyaan}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black text-[10px] shrink-0">
                        {ant.jamSlotBooking || "16:00 WIB"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={slotJamPilih[oh.id] || "Slot 1 (16:00 - 16:20 WIB)"}
                      onChange={(e) =>
                        setSlotJamPilih({ ...slotJamPilih, [oh.id]: e.target.value })
                      }
                      className="p-2.5 bg-white border rounded-xl font-bold"
                    >
                      <option value="Slot 1 (16:00 - 16:20 WIB)">
                        Slot 1 (16:00 - 16:20 WIB)
                      </option>
                      <option value="Slot 2 (16:20 - 16:40 WIB)">
                        Slot 2 (16:20 - 16:40 WIB)
                      </option>
                      <option value="Slot 3 (16:40 - 17:00 WIB)">
                        Slot 3 (16:40 - 17:00 WIB)
                      </option>
                    </select>
                    <input
                      type="text"
                      value={inputTanyaOh[oh.id] || ""}
                      onChange={(e) =>
                        setInputTanyaOh({ ...inputTanyaOh, [oh.id]: e.target.value })
                      }
                      placeholder="Topik konsultasi 1-on-1..."
                      className="p-2.5 bg-white border rounded-xl"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const isi = inputTanyaOh[oh.id];
                      if (!isi) return;
                      const slot = slotJamPilih[oh.id] || "Slot 1 (16:00 - 16:20 WIB)";
                      setOfficeHours(
                        officeHours.map((x) =>
                          x.id === oh.id
                            ? {
                                ...x,
                                antreanPertanyaan: [
                                  ...x.antreanPertanyaan,
                                  {
                                    namaSiswa: userLogin.nama,
                                    pertanyaan: isi,
                                    jamSlotBooking: slot,
                                  },
                                ],
                              }
                            : x
                        )
                      );
                      setInputTanyaOh({ ...inputTanyaOh, [oh.id]: "" });
                      tambahXP(20);
                      alert(`✓ Slot Konsultasi 1-on-1 (${slot}) berhasil dipesan!`);
                    }}
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-black cursor-pointer"
                  >
                    Booking Slot 1-on-1 (+20 XP)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. TAMPILAN PUSAT TRYOUT CBT ANTI-CHEAT
  // ============================================================================
  if (sedangUjian && paketTryoutAktif) {
    return (
      <CbtUjianLanjutanModal
        paket={paketTryoutAktif}
        userNama={userLogin.nama}
        onSelesaiUjian={(skorAkhir, totalPelanggaran, statusAkhir) => {
          onSelesaikanTryout(skorAkhir, totalPelanggaran, statusAkhir);
        }}
        onBatal={onResetTryout}
      />
    );
  }

  if (ujianSelesai && paketTryoutAktif) {
    return (
      <div className="max-w-2xl mx-auto bg-white text-slate-800 p-10 rounded-3xl border text-center space-y-5 shadow-xl">
        <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-3xl font-black">Hasil Evaluasi Tryout CBT</h2>
        <p className="text-slate-500 font-bold">{paketTryoutAktif.judul}</p>
        <div className="text-5xl font-black text-indigo-600">{skorTryout} / 100</div>
        <button
          onClick={onResetTryout}
          className="bg-slate-900 text-white px-7 py-3.5 rounded-2xl font-black text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Kembali ke Daftar Paket Tryout
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-[2.2rem] shadow-xl space-y-2">
        <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
          Proctored CBT Engine + Auto-Randomize &amp; Resume
        </span>
        <h1 className="text-3xl font-black mt-2">
          Pusat Simulasi Ujian CBT, Acak Soal Otomatis &amp; Sensor Pelanggaran
        </h1>
        <p className="text-sm text-slate-300">
          Dilengkapi pengacakan soal otomatis, pemulihan sesi ujian (*auto-resume*) saat kendala
          teknis, kertas corat-coret, dan penguncian tombol mundur.
        </p>
      </div>

      {paketKartuQr && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-600 max-w-xl mx-auto space-y-4 text-center shadow-2xl">
          <QrCode className="w-24 h-24 mx-auto text-slate-900" />
          <div className="font-black text-lg">{paketKartuQr.judul}</div>
          <div className="text-xs font-mono bg-slate-100 p-3 rounded-xl font-bold">
            TOKEN QR PESERTA: HIBAH-{userLogin.id.toUpperCase()}-{paketKartuQr.kategoriTes}
          </div>
          <button
            onClick={() => setPaketKartuQr(null)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black"
          >
            Tutup Kartu QR
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {daftarPaketTryout.map((pkt) => {
          const statusSesi = cekStatusSesiUjian(pkt);
          return (
            <div
              key={pkt.id}
              className="bg-white text-slate-800 p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black">
                    {pkt.kategoriTes} • {pkt.tipeUjian || "Pilihan Ganda"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      statusSesi.terbuka
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {statusSesi.label}
                  </span>
                </div>

                <h3 className="text-xl font-black">{pkt.judul}</h3>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Jadwal Sesi: {pkt.jadwalUjian}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Durasi: <b>{pkt.durasiMenit} Menit</b> • Maks. Pelanggaran:{" "}
                      <b>{pkt.batasPelanggaran}x Pindah Tab</b>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    {pkt.bolehMundur ? "Bisa Mundur Soal" : "Tidak Bisa Mundur"}
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-indigo-600" />
                    {pkt.pakaiCoratCoret ?? true ? "Ada Kertas Corat-Coret" : "Tanpa Corat-Coret"}
                  </span>
                  <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Keyboard className="w-3 h-3 text-rose-600" />
                    {pkt.izinkanKeyboard ? "Keyboard Aktif" : "Keyboard Diblokir"}
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Auto-Random &amp; Resume
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t flex flex-wrap justify-between items-center gap-2">
                <button
                  onClick={() => setPaketKartuQr(pkt)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" /> Kartu QR
                </button>

                <button
                  disabled={!statusSesi.terbuka}
                  onClick={() => onMulaiUjianTryout(pkt)}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {statusSesi.terbuka ? "Mulai / Lanjutkan CBT" : statusSesi.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {riwayatTryout.length > 0 && (
        <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-3">
          <h3 className="font-black text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" /> Riwayat Percobaan &amp; Log
            Pelanggaran CBT Anda
          </h3>
          {riwayatTryout.map((rw) => (
            <div
              key={rw.id}
              className="p-4 rounded-2xl bg-slate-50 border flex flex-wrap justify-between items-center text-xs font-bold"
            >
              <span>
                {rw.paketJudul} ({rw.statusAkhir})
              </span>
              <span>
                Skor: <b className="text-indigo-600">{rw.skor}/100</b> • Pelanggaran:{" "}
                <b className="text-rose-600">{rw.jumlahPelanggaran}x</b>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};