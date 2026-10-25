"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Wand2,
  Clock,
  FolderArchive,
} from "lucide-react";
import {
  AkunPengguna,
  TugasItem,
  PengumpulanTugas,
  PresensiItem,
  RppItem,
  SoalTryout,
  KelompokBelajar,
  JadwalLiveItem,
} from "../../types";
import { analisisRubrikEsaiAI } from "../../mockData";

interface GuruLainnyaProps {
  tabAktif: "tugas_rubrik" | "analitik" | "bank_soal" | "rombel_live" | "rpp_repo";
  userLogin: AkunPengguna;
  daftarTugas: TugasItem[];
  daftarPengumpulan: PengumpulanTugas[];
  setDaftarPengumpulan: React.Dispatch<React.SetStateAction<PengumpulanTugas[]>>;
  daftarPresensi: PresensiItem[];
  rppList: RppItem[];
  setRppList: React.Dispatch<React.SetStateAction<RppItem[]>>;
  bankSoalKolektif: SoalTryout[];
  setBankSoalKolektif: (list: SoalTryout[]) => void;
  soalTryoutDraft: SoalTryout[];
  setSoalTryoutDraft: (list: SoalTryout[]) => void;
  daftarKelompok: KelompokBelajar[];
  setDaftarKelompok: (list: KelompokBelajar[]) => void;
  jadwalLive: JadwalLiveItem[];
  setJadwalLive: (list: JadwalLiveItem[]) => void;
  kirimNotifikasiKeUser: (
    targetIds: string[],
    judul: string,
    pesan: string,
    pengirim: string,
    namaKelas?: string
  ) => void;
}

export const GuruLainnyaSection: React.FC<GuruLainnyaProps> = ({
  tabAktif,
  userLogin,
  daftarTugas,
  daftarPengumpulan,
  setDaftarPengumpulan,
  daftarPresensi,
  rppList,
  setRppList,
  bankSoalKolektif,
  setBankSoalKolektif,
  soalTryoutDraft,
  setSoalTryoutDraft,
  daftarKelompok,
  setDaftarKelompok,
  jadwalLive,
  setJadwalLive,
  kirimNotifikasiKeUser,
}) => {
  const [inputNilaiGuru, setInputNilaiGuru] = useState<{ [subId: string]: number }>({});
  const [inputFeedbackGuru, setInputFeedbackGuru] = useState<{ [subId: string]: string }>({});

  const [topikBankSoalBaru, setTopikBankSoalBaru] = useState("");
  const [tanyaBankSoalBaru, setTanyaBankSoalBaru] = useState("");
  const [opsiBankSoalBaru, setOpsiBankSoalBaru] = useState<string[]>(["", "", "", ""]);
  const [kunciBankSoalBaru, setKunciBankSoalBaru] = useState<number>(0);
  const [bahasBankSoalBaru, setBahasBankSoalBaru] = useState("");

  const [namaRombelBaru, setNamaRombelBaru] = useState("");
  const [pengumumanRombelBaru, setPengumumanRombelBaru] = useState("");
  const [judulLiveBaru, setJudulLiveBaru] = useState("");
  const [jadwalJamLiveBaru, setJadwalJamLiveBaru] = useState("");

  const [judulRppBaru, setJudulRppBaru] = useState("");
  const [mapelRppBaru, setMapelRppBaru] = useState("");
  const [jenjangRppBaru] = useState("Kelas 11 MIPA");
  const [kurikulumRppBaru, setKurikulumRppBaru] = useState<
    "Kurikulum Merdeka" | "K13 Revisi" | "Silabus Kampus / RPS"
  >("Kurikulum Merdeka");
  const [tujuanRppBaru, setTujuanRppBaru] = useState("");
  const [urlRppBaru, setUrlRppBaru] = useState("https://drive.google.com");

  if (tabAktif === "tugas_rubrik") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <h3 className="text-xl font-black flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" /> Penilaian Tugas &amp; AI Rubric
            Scoring Assistant
          </h3>
          <div className="space-y-4">
            {daftarPengumpulan.map((sub) => {
              const tugasInfo = daftarTugas.find((t) => t.id === sub.tugasId);
              return (
                <div
                  key={sub.id}
                  className="p-5 border rounded-2xl bg-slate-50 space-y-3 text-sm"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 font-bold">
                    <div>
                      <span>{sub.siswaNama} — </span>
                      <span className="text-indigo-600">{tugasInfo?.judul || "Tugas"}</span>
                      {tugasInfo?.jenisTugas && (
                        <span className="ml-2 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {tugasInfo.jenisTugas}
                        </span>
                      )}
                    </div>
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
                      className="bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
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
                      className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold cursor-pointer"
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
    );
  }

  if (tabAktif === "bank_soal") {
    return (
      <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
        <h3 className="text-2xl font-black">Bank Soal Kolektif Bersama</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!tanyaBankSoalBaru.trim()) return;
            const soalBaru: SoalTryout = {
              id: "bank-" + Date.now(),
              rumus: topikBankSoalBaru || "Sains & Akademik",
              pertanyaan: tanyaBankSoalBaru,
              opsi: opsiBankSoalBaru.map((o, i) => o || `Opsi ${String.fromCharCode(65 + i)}`),
              jawabanBenar: kunciBankSoalBaru,
              pembahasan: bahasBankSoalBaru || "Sesuai konsep dasar materi.",
              penyumbangNama: userLogin.nama,
            };
            setBankSoalKolektif([soalBaru, ...bankSoalKolektif]);
            setTanyaBankSoalBaru("");
            setTopikBankSoalBaru("");
            setBahasBankSoalBaru("");
          }}
          className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-4 text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              value={topikBankSoalBaru}
              onChange={(e) => setTopikBankSoalBaru(e.target.value)}
              placeholder="Topik / Kategori..."
              className="p-3 border rounded-xl bg-white font-bold"
            />
            <input
              type="text"
              required
              value={tanyaBankSoalBaru}
              onChange={(e) => setTanyaBankSoalBaru(e.target.value)}
              placeholder="Pertanyaan Soal..."
              className="md:col-span-2 p-3 border rounded-xl bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opsiBankSoalBaru.map((op, oIdx) => (
              <div
                key={oIdx}
                className={`flex items-center gap-2 p-2 rounded-xl border-2 bg-white ${
                  kunciBankSoalBaru === oIdx ? "border-emerald-500" : "border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setKunciBankSoalBaru(oIdx)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black shrink-0 cursor-pointer ${
                    kunciBankSoalBaru === oIdx
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {kunciBankSoalBaru === oIdx
                    ? "✓ Kunci"
                    : `Opsi ${String.fromCharCode(65 + oIdx)}`}
                </button>
                <input
                  type="text"
                  value={op}
                  onChange={(e) => {
                    const baru = [...opsiBankSoalBaru];
                    baru[oIdx] = e.target.value;
                    setOpsiBankSoalBaru(baru);
                  }}
                  placeholder={`Isi Opsi ${String.fromCharCode(65 + oIdx)}...`}
                  className="w-full text-xs font-semibold focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={bahasBankSoalBaru}
              onChange={(e) => setBahasBankSoalBaru(e.target.value)}
              placeholder="Pembahasan Kunci Jawaban..."
              className="flex-1 p-3 border rounded-xl bg-white text-xs"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs cursor-pointer"
            >
              Simpan ke Bank Soal
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {bankSoalKolektif.map((bs) => (
            <div
              key={bs.id}
              className="p-6 border border-slate-300 rounded-2xl bg-white space-y-3"
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-black text-indigo-600">
                  {bs.rumus || "Bank Soal"} • {bs.penyumbangNama || "Tim Kontributor"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSoalTryoutDraft([...soalTryoutDraft, bs]);
                    alert("✓ Soal dimasukkan ke Draft Paket Tryout CBT!");
                  }}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-black cursor-pointer"
                >
                  + Masukkan ke Draft Tryout CBT
                </button>
              </div>
              <p className="font-black text-base text-slate-900">{bs.pertanyaan}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tabAktif === "rombel_live") {
    return (
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
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
            >
              + Buat Rombel Baru
            </button>
          </form>
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
              placeholder="Hari & Jam..."
              className="w-full p-3 border rounded-xl bg-slate-50"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer"
            >
              + Jadwalkan Sesi Live
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (tabAktif === "rpp_repo") {
    return (
      <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <FolderArchive className="w-6 h-6 text-indigo-600" /> Bank RPP &amp; RPS Kampus
        </h2>
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
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-black cursor-pointer"
          >
            + Bagikan RPP
          </button>
        </form>
      </div>
    );
  }

  return (
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
  );
};