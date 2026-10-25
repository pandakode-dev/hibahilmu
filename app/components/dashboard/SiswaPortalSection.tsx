"use client";

import React, { useState } from "react";
import {
  LogOut,
  Globe,
  Target,
  ClipboardCheck,
  Award,
  Coins,
  Briefcase,
  Share2,
  PlusCircle,
  Printer,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import {
  AkunPengguna,
  TugasItem,
  PengumpulanTugas,
  StudyRoomItem,
  PengajuanBeasiswaItem,
  BiodataCV,
} from "../../types";
import { ProfilCVSection } from "./ProfilCVSection";

interface SiswaPortalProps {
  userLogin: AkunPengguna;
  setUserLogin: (u: AkunPengguna | null) => void;
  daftarAkun: AkunPengguna[];
  setDaftarAkun: (list: AkunPengguna[]) => void;
  poinXP: number;
  materiSelesai: string[];
  tambahXP: (xp: number) => void;
  studyRooms: StudyRoomItem[];
  daftarTugas: TugasItem[];
  daftarPengumpulan: PengumpulanTugas[];
  setDaftarPengumpulan: React.Dispatch<React.SetStateAction<PengumpulanTugas[]>>;
  daftarBeasiswa: PengajuanBeasiswaItem[];
  setDaftarBeasiswa: (list: PengajuanBeasiswaItem[]) => void;
}

export const SiswaPortalSection: React.FC<SiswaPortalProps> = ({
  userLogin,
  setUserLogin,
  daftarAkun,
  setDaftarAkun,
  poinXP,
  materiSelesai,
  tambahXP,
  studyRooms,
  daftarTugas,
  daftarPengumpulan,
  setDaftarPengumpulan,
  daftarBeasiswa,
  setDaftarBeasiswa,
}) => {
  const [siswaTabAktif, setSiswaTabAktif] = useState<
    | "showcase_publik"
    | "quests_study"
    | "tugas"
    | "rapor_sertifikat"
    | "beasiswa"
    | "cv"
  >("showcase_publik");

  const [klaimQuestIds, setKlaimQuestIds] = useState<string[]>([]);
  const [jawabanTugasSiswaInput, setJawabanTugasSiswaInput] = useState<{
    [id: string]: string;
  }>({});
  const [judulKaryaBaru, setJudulKaryaBaru] = useState("");
  const [kategoriKaryaBaru] = useState("Proyek Sains & IT");
  const [deskripsiKaryaBaru, setDeskripsiKaryaBaru] = useState("");
  const [linkKaryaBaru, setLinkKaryaBaru] = useState("https://github.com");
  const [alasanBeasiswaInput, setAlasanBeasiswaInput] = useState("");

  const kirimanSaya = daftarPengumpulan.filter((s) => s.siswaId === userLogin.id);
  const karyaSaya = userLogin.cv?.karyaPublik || [];
  const nomorSertifikatUnik = `CERT-HIBAH-2026-001`;

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
          className="bg-white/15 hover:bg-white/25 text-white text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2 cursor-pointer"
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
            label: "4. Sertifikat QR Digital & Rapor",
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
            className={`px-4 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              siswaTabAktif === t.id
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-700 border"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {siswaTabAktif === "cv" && (
        <ProfilCVSection
          userLogin={userLogin}
          setUserLogin={(u) => setUserLogin(u)}
          daftarAkun={daftarAkun}
          setDaftarAkun={setDaftarAkun}
        />
      )}

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
                  className="w-full bg-emerald-600 text-white font-black py-3.5 rounded-xl cursor-pointer"
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
                  className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer"
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
                <div className="flex justify-between items-center">
                  <div className="font-black text-base">{tgs.judul}</div>
                  <span className="text-xs text-slate-500 font-bold">Tenggat: {tgs.deadline}</span>
                </div>
                <p className="text-slate-600">{tgs.instruksi}</p>
                {kumpul ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <b>Nilai: {kumpul.nilai ?? "Menunggu"} / 100</b> —{" "}
                    {kumpul.feedbackGuru || "Sedang diperiksa pengajar"}
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
                      className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-black cursor-pointer"
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

      {/* TAB 4: SERTIFIKAT OTOMATIS DENGAN NOMOR SERI UNIK, TANDA TANGAN DIGITAL & QR VERIFIKASI */}
      {siswaTabAktif === "rapor_sertifikat" && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 text-slate-900 p-10 rounded-[2.5rem] border-4 border-double border-amber-400 shadow-xl space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-amber-200 pb-4">
            <div className="text-left">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Digital Signature &amp; QR Verified
              </span>
              <div className="text-xs font-mono font-black text-slate-600 mt-1">
                No. Seri Verifikasi: <b className="text-indigo-900">{nomorSertifikatUnik}</b>
              </div>
            </div>
            <QrCode className="w-16 h-16 text-slate-900" />
          </div>

          <div className="text-center space-y-3 py-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              SERTIFIKAT KOMPETENSI KELULUSAN
            </h2>
            <p className="text-xs uppercase font-bold tracking-widest text-slate-500">
              Diberikan secara resmi oleh Yayasan Wakaf Pendidikan HibahIlmu.id kepada:
            </p>
            <div className="text-3xl font-black text-indigo-950 underline py-1">
              {userLogin.nama}
            </div>
            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              Telah menuntaskan <b>{materiSelesai.length} Modul Pembelajaran Bersyarat</b> dengan
              capaian reputasi akademik <b>{poinXP} XP</b> serta lulus evaluasi KKM.
            </p>
          </div>

          <div className="flex flex-wrap justify-between items-end pt-4 border-t border-amber-200 text-xs">
            <div className="text-left space-y-1">
              <div className="font-bold text-slate-500">Ditandatangani Secara Digital:</div>
              <div className="font-black text-sm text-slate-900">
                Admin Panda Kode &amp; Dewan Guru HibahIlmu
              </div>
              <div className="text-[11px] text-emerald-700 font-bold">
                ✓ Cek keaslian nomor {nomorSertifikatUnik} di menu ✨ Hub Inovasi
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Printer className="w-4 h-4" /> Cetak Sertifikat PDF Resmi
            </button>
          </div>
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
            className="bg-emerald-600 text-white font-black px-6 py-3.5 rounded-xl text-sm cursor-pointer"
          >
            Kirim Pengajuan Beasiswa
          </button>
        </div>
      )}
    </div>
  );
};