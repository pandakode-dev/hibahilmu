"use client";

import React, { useState } from "react";
import {
  Timer,
  MapPin,
  Calendar,
  Maximize2,
  ShieldAlert,
  Play,
  QrCode,
  Printer,
  HelpCircle,
  ThumbsUp,
  Send,
  Video,
  Crown,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import {
  PaketTryout,
  AkunPengguna,
  RiwayatPercobaanTryout,
  DiskusiPR,
  OfficeHourItem,
  JawabanDiskusi,
} from "../types";
import { DATA_TRANSPARANSI_DONASI } from "../mockData";

interface TryoutDanForumProps {
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
  setIndeksSoalTryoutAktif: (idx: number) => void;
  jawabanUserTryout: { [key: number]: number };
  setJawabanUserTryout: (jwb: { [key: number]: number }) => void;
  jumlahPelanggaranUjian: number;
  pesanPeringatanCheat: string;
  skorTryout: number;
  onMulaiUjianTryout: (pkt: PaketTryout) => void;
  onSelesaikanTryout: () => void;
  onResetTryout: () => void;
  daftarDiskusi: DiskusiPR[];
  setDaftarDiskusi: React.Dispatch<React.SetStateAction<DiskusiPR[]>>;
  officeHours: OfficeHourItem[];
  setOfficeHours: React.Dispatch<React.SetStateAction<OfficeHourItem[]>>;
  tambahXP: (xp: number) => void;
}

export function formatMenitDetik(detik: number) {
  const m = Math.floor(detik / 60);
  const s = detik % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export const TryoutDanForumView: React.FC<TryoutDanForumProps> = ({
  modeMenu,
  userLogin,
  daftarAkun,
  poinXP,
  daftarPaketTryout,
  riwayatTryout,
  sedangUjian,
  ujianSelesai,
  paketTryoutAktif,
  sisaWaktu,
  indeksSoalTryoutAktif,
  setIndeksSoalTryoutAktif,
  jawabanUserTryout,
  setJawabanUserTryout,
  jumlahPelanggaranUjian,
  pesanPeringatanCheat,
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
  const [filterKategoriTryout, setFilterKategoriTryout] = useState<string>("SEMUA");
  const [cetakKartuQrPaket, setCetakKartuQrPaket] = useState<PaketTryout | null>(null);

  const [judulTanyaBaru, setJudulTanyaBaru] = useState("");
  const [tanyaBaru, setTanyaBaru] = useState("");
  const [inputJawabDiskusi, setInputJawabDiskusi] = useState<{ [id: string]: string }>({});
  const [pertanyaanAntreanAhli, setPertanyaanAntreanAhli] = useState<{ [id: string]: string }>({});

  const donasiList = DATA_TRANSPARANSI_DONASI;

  // 1. LEADERBOARD XP & TRANSPARANSI WAKAF
  if (modeMenu === "leaderboard") {
    const daftarUrut = daftarAkun
      .filter((a) => a.status === "approved")
      .map((a) => ({
        ...a,
        xpTampil: a.id === userLogin.id ? poinXP : a.xp || 200,
      }))
      .sort((a, b) => b.xpTampil - a.xpTampil);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="bg-black/20 text-xs font-black px-3.5 py-1 rounded-full uppercase">
              Hall of Fame &amp; Transparansi Wakaf
            </span>
            <h1 className="text-3xl font-black mt-2 flex items-center gap-2">
              <Crown className="w-8 h-8 text-amber-200" /> Papan Peringkat XP Nasional
            </h1>
          </div>
          <div className="bg-white/20 px-5 py-3 rounded-2xl text-right">
            <div className="text-xs font-bold uppercase">Skor XP Anda</div>
            <div className="text-2xl font-black">{poinXP} XP</div>
          </div>
        </div>

        <div className="bg-white text-slate-800 rounded-3xl border shadow-xs divide-y">
          {daftarUrut.map((usr, idx) => (
            <div
              key={usr.id}
              className={`p-5 flex items-center justify-between gap-4 ${
                usr.id === userLogin.id ? "bg-emerald-50/70" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm ${
                    idx === 0
                      ? "bg-amber-400 text-slate-950"
                      : idx === 1
                      ? "bg-slate-300 text-slate-900"
                      : idx === 2
                      ? "bg-amber-700 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <div className="font-black text-base text-slate-900 flex items-center gap-2">
                    {usr.nama}
                    <span className="text-[11px] uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                      {usr.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{usr.infoTambahan}</div>
                </div>
              </div>
              <div className="font-black text-lg text-amber-600">{usr.xpTampil} XP</div>
            </div>
          ))}
        </div>

        {/* Laporan Transparansi Donasi */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div>
            <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              Transparansi Keuangan
            </span>
            <h2 className="text-2xl font-black mt-2">Laporan Wakaf &amp; Donasi Pendidikan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="text-xs font-bold text-slate-300">Total Dana Terkumpul</div>
              <div className="text-3xl font-black text-emerald-400">
                Rp {donasiList.totalTerkumpul.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-slate-400">
                Target Tahunan: Rp {donasiList.targetTahunan.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-2 text-xs">
              <div className="font-bold text-slate-300 mb-2">Alokasi Penyaluran Dana:</div>
              {donasiList.alokasiPenggunaan.map((alok, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {alok.kategori} ({alok.persentase}%)
                  </span>
                  <b className="text-amber-300">Rp {alok.nominal.toLocaleString("id-ID")}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FORUM DISKUSI PR & TANYA AHLI (LIVE OFFICE HOURS)
  if (modeMenu === "forum") {
    return (
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                Live Expert Mentoring
              </span>
              <h2 className="text-2xl font-black mt-2 flex items-center gap-2">
                <Video className="w-6 h-6 text-emerald-400" /> Jadwal Konsultasi &amp; Tanya Ahli
                (Office Hours)
              </h2>
              <p className="text-xs text-indigo-200 mt-1">
                Titipkan pertanyaan sulitmu untuk dibahas langsung saat sesi Live bersama Pakar/Dosen
                Relawan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officeHours.map((oh) => (
              <div
                key={oh.id}
                className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-3 text-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-black text-base text-amber-300">{oh.namaAhli}</div>
                    <div className="text-xs text-emerald-300 font-bold">{oh.keahlian}</div>
                  </div>
                  <a
                    href={oh.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black"
                  >
                    Gabung Live →
                  </a>
                </div>
                <div className="font-bold text-white">{oh.topikBahasan}</div>
                <div className="text-xs text-slate-300">🕒 {oh.jadwalHariJam}</div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-200">
                    Antrean Pertanyaan Siswa ({oh.antreanPertanyaan.length}):
                  </div>
                  {oh.antreanPertanyaan.map((q, idx) => (
                    <div key={idx} className="text-xs bg-black/25 p-2.5 rounded-xl">
                      <b>{q.namaSiswa}:</b> &ldquo;{q.pertanyaan}&rdquo;
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={pertanyaanAntreanAhli[oh.id] || ""}
                      onChange={(e) =>
                        setPertanyaanAntreanAhli({
                          ...pertanyaanAntreanAhli,
                          [oh.id]: e.target.value,
                        })
                      }
                      placeholder="Titip pertanyaan ke Pakar..."
                      className="flex-1 p-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => {
                        const isi = (pertanyaanAntreanAhli[oh.id] || "").trim();
                        if (!isi) return;
                        setOfficeHours((prev) =>
                          prev.map((item) =>
                            item.id === oh.id
                              ? {
                                  ...item,
                                  antreanPertanyaan: [
                                    ...item.antreanPertanyaan,
                                    { namaSiswa: userLogin.nama, pertanyaan: isi },
                                  ],
                                }
                              : item
                          )
                        );
                        setPertanyaanAntreanAhli({ ...pertanyaanAntreanAhli, [oh.id]: "" });
                        tambahXP(15);
                      }}
                      className="bg-amber-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-black"
                    >
                      Antrekan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORUM TANYA PR */}
        <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-4">
          <h2 className="font-black text-2xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" /> Forum Tanya Jawab PR Sebaya
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!tanyaBaru.trim()) return;
              const baru: DiskusiPR = {
                id: "pr-" + Date.now(),
                penanya: `${userLogin.nama} (${userLogin.email})`,
                jenjang: "SMA & Kuliah",
                mapel: "Sains & Umum",
                judul: judulTanyaBaru || "Pertanyaan Diskusi",
                pertanyaan: tanyaBaru,
                waktu: "Baru saja",
                likes: 0,
                solved: false,
                jawaban: [],
              };
              setDaftarDiskusi([baru, ...daftarDiskusi]);
              setJudulTanyaBaru("");
              setTanyaBaru("");
              tambahXP(20);
            }}
            className="space-y-3"
          >
            <input
              type="text"
              required
              value={judulTanyaBaru}
              onChange={(e) => setJudulTanyaBaru(e.target.value)}
              placeholder="Judul Topik Pertanyaan..."
              className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm font-bold"
            />
            <textarea
              rows={3}
              required
              value={tanyaBaru}
              onChange={(e) => setTanyaBaru(e.target.value)}
              placeholder="Tulis detail soal atau bagian materi yang belum dipahami..."
              className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white font-black px-6 py-3.5 rounded-xl text-xs flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Kirim Pertanyaan (+20 XP)
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {daftarDiskusi.map((d) => (
            <div
              key={d.id}
              className="bg-white text-slate-800 p-6 rounded-3xl border space-y-4 text-sm"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {d.jenjang} • {d.mapel}
                  </span>
                  <h3 className="font-black text-lg mt-2">{d.judul}</h3>
                  <p className="text-xs text-slate-500">Oleh: {d.penanya}</p>
                </div>
                <button
                  onClick={() =>
                    setDaftarDiskusi((prev) =>
                      prev.map((x) => (x.id === d.id ? { ...x, likes: x.likes + 1 } : x))
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> {d.likes}
                </button>
              </div>
              <p className="text-slate-700">{d.pertanyaan}</p>

              <div className="space-y-2 pl-4 border-l-2 border-emerald-500">
                {d.jawaban.map((j) => (
                  <div key={j.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="font-black text-slate-900">
                      {j.penjawab} ({j.rolePenjawab})
                    </div>
                    <p className="text-slate-700">{j.isi}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={inputJawabDiskusi[d.id] || ""}
                  onChange={(e) =>
                    setInputJawabDiskusi({ ...inputJawabDiskusi, [d.id]: e.target.value })
                  }
                  placeholder="Bantu jawab pertanyaan temanmu..."
                  className="flex-1 p-3 bg-slate-50 border rounded-xl text-xs"
                />
                <button
                  onClick={() => {
                    const teks = (inputJawabDiskusi[d.id] || "").trim();
                    if (!teks) return;
                    const jwbBaru: JawabanDiskusi = {
                      id: "jwb-" + Date.now(),
                      penjawab: userLogin.nama,
                      rolePenjawab: userLogin.role,
                      isi: teks,
                      waktu: "Baru saja",
                      upvotes: 0,
                    };
                    setDaftarDiskusi((prev) =>
                      prev.map((item) =>
                        item.id === d.id
                          ? { ...item, solved: true, jawaban: [...item.jawaban, jwbBaru] }
                          : item
                      )
                    );
                    setInputJawabDiskusi({ ...inputJawabDiskusi, [d.id]: "" });
                    tambahXP(25);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
                >
                  Jawab (+25 XP)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. SIMULASI TRYOUT CBT & KARTU UJIAN QR CODE
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* MODAL KARTU PESERTA UJIAN QR CODE */}
      {cetakKartuQrPaket && (
        <div className="bg-white text-slate-900 p-8 rounded-3xl border-4 border-double border-indigo-600 shadow-2xl space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div className="flex items-center gap-3">
              <img
                src="/hibahilmu.jpg"
                alt="Logo HibahIlmu"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-12 h-12 rounded-xl object-cover border"
              />
              <div>
                <div className="text-xs font-black uppercase text-indigo-600">
                  Kartu Tanda Peserta Ujian CBT Resmi
                </div>
                <h3 className="text-xl font-black">{cetakKartuQrPaket.judul}</h3>
              </div>
            </div>
            <button
              onClick={() => setCetakKartuQrPaket(null)}
              className="text-xs font-bold text-rose-600"
            >
              ✕ Tutup Kartu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2 text-sm">
              <div>
                Nama Peserta: <b>{userLogin.nama}</b>
              </div>
              <div>
                Email Terdaftar: <b>{userLogin.email}</b>
              </div>
              <div>
                Kategori Tes: <b>{cetakKartuQrPaket.kategoriTes}</b>
              </div>
              <div>
                Lokasi Ujian: <b>{cetakKartuQrPaket.alamatLokasi}</b>
              </div>
              <div>
                Jadwal Pelaksanaan: <b>{cetakKartuQrPaket.jadwalUjian}</b>
              </div>
              <div className="pt-2 text-xs text-emerald-700 font-bold">
                Token QR Presensi:{" "}
                <span className="font-mono bg-emerald-50 px-2 py-1 rounded border">
                  HIBAH-{userLogin.id.toUpperCase()}-{cetakKartuQrPaket.kategoriTes}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HIBAH-${userLogin.id.toUpperCase()}-${cetakKartuQrPaket.kategoriTes}`}
                alt="QR Code Presensi Ujian"
                className="w-32 h-32 rounded-lg border p-1 bg-white"
              />
              <span className="text-[11px] font-bold text-slate-500 mt-2">
                Scan QR untuk Presensi Pengawas
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Cetak Kartu Ujian (PDF)
            </button>
          </div>
        </div>
      )}

      {!sedangUjian && !ujianSelesai && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-4">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
              Proctored CBT Center &amp; QR Attendance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black">
              Pusat Ujian TPA, TOEP, TOEFL &amp; UTBK
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Dilengkapi pengawasan layar penuh (Fullscreen Lock), sensor pindah tab otomatis, dan
              pencetakan Kartu Ujian ber-QR Code untuk presensi ruangan.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["SEMUA", "TPA", "TOEP", "TOEFL", "UTBK"].map((kat) => (
                <button
                  key={kat}
                  onClick={() => setFilterKategoriTryout(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                    filterKategoriTryout === kat
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {kat === "SEMUA" ? "Semua Kategori Tes" : `Tes ${kat}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {daftarPaketTryout
              .filter(
                (p) =>
                  filterKategoriTryout === "SEMUA" || p.kategoriTes === filterKategoriTryout
              )
              .map((pkt) => {
                const percobaanUser = riwayatTryout.filter(
                  (r) => r.paketId === pkt.id && r.userId === userLogin.id
                ).length;

                return (
                  <div
                    key={pkt.id}
                    className="bg-white text-slate-800 p-7 rounded-3xl border shadow-sm flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase px-3 py-1 rounded-lg bg-indigo-100 text-indigo-900">
                          Kategori: {pkt.kategoriTes}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Percobaan: {percobaanUser} / {pkt.batasPercobaan}x
                        </span>
                      </div>
                      <h3 className="text-xl font-black">{pkt.judul}</h3>
                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border">
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Lokasi: {pkt.alamatLokasi}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold">
                          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Jadwal: {pkt.jadwalUjian}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold">
                          <Maximize2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Mode: Fullscreen Wajib • Maks {pkt.batasPelanggaran}x Pelanggaran</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex flex-wrap justify-between items-center gap-2">
                      <button
                        onClick={() => setCetakKartuQrPaket(pkt)}
                        className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-indigo-600" /> Kartu QR Ujian
                      </button>

                      <button
                        onClick={() => onMulaiUjianTryout(pkt)}
                        disabled={percobaanUser >= pkt.batasPercobaan}
                        className={`px-5 py-3 rounded-xl font-black text-xs flex items-center gap-2 ${
                          percobaanUser >= pkt.batasPercobaan
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                        }`}
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {percobaanUser >= pkt.batasPercobaan
                          ? "Kuota Habis"
                          : "Mulai Ujian Fullscreen"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {sedangUjian && paketTryoutAktif && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border-2 border-indigo-600 shadow-2xl space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-900">
                Ujian Berlangsung • {paketTryoutAktif.kategoriTes}
              </span>
              <h3 className="font-black text-lg mt-1">{paketTryoutAktif.judul}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black px-3 py-2 rounded-xl bg-rose-100 text-rose-800">
                Pelanggaran: {jumlahPelanggaranUjian} / {paketTryoutAktif.batasPelanggaran}
              </span>
              <div className="bg-rose-600 text-white px-4 py-2 rounded-xl font-mono font-black text-lg flex items-center gap-2">
                <Timer className="w-5 h-5" /> {formatMenitDetik(sisaWaktu)}
              </div>
            </div>
          </div>

          {pesanPeringatanCheat && (
            <div className="p-4 rounded-2xl bg-rose-600 text-white font-black text-sm flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <span>{pesanPeringatanCheat}</span>
            </div>
          )}

          {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif] && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Soal {indeksSoalTryoutAktif + 1} dari {paketTryoutAktif.daftarSoal.length}
              </div>
              <p className="text-xl font-black">
                {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].pertanyaan}
              </p>
              {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].rumus && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl">
                  <BlockMath
                    math={paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].rumus || ""}
                  />
                </div>
              )}
              <div className="space-y-3 pt-2">
                {paketTryoutAktif.daftarSoal[indeksSoalTryoutAktif].opsi.map((op, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setJawabanUserTryout({
                        ...jawabanUserTryout,
                        [indeksSoalTryoutAktif]: idx,
                      })
                    }
                    className={`w-full text-left p-4 rounded-2xl border-2 font-bold ${
                      jawabanUserTryout[indeksSoalTryoutAktif] === idx
                        ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t">
            <button
              disabled={indeksSoalTryoutAktif === 0}
              onClick={() => setIndeksSoalTryoutAktif(indeksSoalTryoutAktif - 1)}
              className="px-5 py-2.5 rounded-xl border font-bold text-sm disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            {indeksSoalTryoutAktif < paketTryoutAktif.daftarSoal.length - 1 ? (
              <button
                onClick={() => setIndeksSoalTryoutAktif(indeksSoalTryoutAktif + 1)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                onClick={onSelesaikanTryout}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm"
              >
                Kumpulkan Ujian
              </button>
            )}
          </div>
        </div>
      )}

      {ujianSelesai && paketTryoutAktif && (
        <div className="bg-white text-slate-800 p-8 rounded-3xl border text-center space-y-6">
          <h2 className="text-2xl font-black">Hasil Evaluasi {paketTryoutAktif.judul}</h2>
          <div className="text-6xl font-black text-emerald-600">{skorTryout}</div>
          <button
            onClick={onResetTryout}
            className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl text-sm"
          >
            Kembali ke Daftar Paket Tryout
          </button>
        </div>
      )}
    </div>
  );
};