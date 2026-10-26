"use client";

import React, { useState } from "react";
import {
  Users,
  AlertTriangle,
  FileDown,
  PlusCircle,
  Send,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { JenjangItem, RppItem, AkunPengguna } from "../../types";

interface GuruCoTeachingProps {
  userLogin: AkunPengguna | null;
  daftarJenjang: JenjangItem[];
  rppList: RppItem[];
  kirimBroadcastNotif: (
    judul: string,
    pesan: string,
    tipeNotif?: "tugas_deadline" | "kuis_tutup" | "webinar_live" | "info_umum"
  ) => void;
}

export const GuruCoTeachingSection: React.FC<GuruCoTeachingProps> = ({
  userLogin,
  daftarJenjang,
  rppList,
  kirimBroadcastNotif,
}) => {
  const semuaModul = daftarJenjang.flatMap((j) => j.kelas);

  // 1. State Multi-Teacher Co-Teaching
  const [daftarTimPengajar, setDaftarTimPengajar] = useState([
    {
      id: "co-1",
      judulModul: semuaModul[0]?.judul || "Modul 1: Komunikasi Data Dasar",
      pengajarUtama: "Bapak Budi Santoso, M.Pd",
      coTeacherNama: "Dr. Hendra Wijaya, M.T.",
      peranCoTeacher: "Reviewer Rubrik Esai & Diskusi Bab",
    },
    {
      id: "co-2",
      judulModul: "Modul 1: Hukum II Newton & Energi Kinetik",
      pengajarUtama: "Bapak Budi Santoso, M.Pd",
      coTeacherNama: "Bunda Siti Aminah, S.Pd",
      peranCoTeacher: "Asisten Kuis & Klinik Konsultasi",
    },
  ]);
  const [modulPilihCo, setModulPilihCo] = useState(
    semuaModul[0]?.judul || "Modul 1: Komunikasi Data Dasar"
  );
  const [namaCoTeacherBaru, setNamaCoTeacherBaru] = useState("");
  const [peranCoTeacherBaru, setPeranCoTeacherBaru] = useState(
    "Ko-Instruktur & Penilai Tugas"
  );

  // 2. State AI Early Warning System (Analisis Prediktif Kesulitan Siswa)
  const [siswaBerisiko, setSiswaBerisiko] = useState([
    {
      id: "ews-1",
      namaSiswa: "Dimas Anggara",
      kelas: "Teknik Informatika / SMA Kelas 12",
      indikatorMasalah: "Skor Kuis Modul 1 masih 60/100 (di bawah KKM 80) & 1 Tugas hampir tutup",
      tingkatRisiko: "Tinggi",
      sudahIntervensi: false,
    },
    {
      id: "ews-2",
      namaSiswa: "Fajar Nugraha",
      kelas: "SMA Kelas 11 MIPA",
      indikatorMasalah: "2x Percobaan kuis Hukum Newton belum mencapai nilai KKM",
      tingkatRisiko: "Sedang",
      sudahIntervensi: false,
    },
  ]);

  // 3. Fungsi Ekspor Silabus & RPP ke Dokumen Word (.doc) Standar Nasional
  const handleUnduhRppDocStandarNasional = (rpp: RppItem) => {
    const kontenDoc = `===============================================================
DOKUMEN RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / MODUL AJAR RESMI
STANDAR ADMINISTRASI KURIKULUM NASIONAL - HIBAHILMU.ID
===============================================================

1. IDENTITAS MODUL AJAR
   - Judul RPP / RPS   : ${rpp.judulRpp}
   - Mata Pelajaran    : ${rpp.mataPelajaran}
   - Jenjang / Kelas   : ${rpp.jenjangKelas}
   - Standar Kurikulum : ${rpp.kurikulum}
   - Penyusun Utama    : ${rpp.pembuatNama}
   - Tanggal Terbit    : ${rpp.tanggalUpload}

2. CAPAIAN & TUJUAN PEMBELAJARAN
   ${rpp.ringkasanTujuan}

3. SKENARIO PEMBELAJARAN BERURUTAN (MASTERY LEARNING)
   - Kegiatan Pendahuluan (15 Menit) : Apersepsi & Kuis Diagnostik.
   - Kegiatan Inti (60 Menit)        : Eksplorasi Bab Interaktif & Diskusi Kontekstual.
   - Kegiatan Penutup (15 Menit)     : Evaluasi KKM & Tugas Proyek Mandiri.

4. ASESMEN & RUBRIK PENILAIAN AI
   - Kriteria Ketuntasan Minimal (KKM): 80 / 100
   - Komponen Rubrik Esai: Kedalaman Argumen (40%), Tata Bahasa (30%), Referensi (30%).

Disahkan secara digital melalui Platform Wakaf Pendidikan HibahIlmu.id
===============================================================`;

    const blob = new Blob([kontenDoc], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPP_Standar_Nasional_${rpp.judulRpp.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* 1. MULTI-TEACHER CO-TEACHING & 2. AI EARLY WARNING SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
              Collaborative Teaching Studio
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Fitur Multi-Teacher Co-Teaching
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambahkan pengajar pendamping atau dosen asisten pada satu modul untuk berbagi tugas
              koreksi esai dan tanya-jawab bab.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!namaCoTeacherBaru.trim()) return;
              setDaftarTimPengajar([
                {
                  id: "co-" + Date.now(),
                  judulModul: modulPilihCo,
                  pengajarUtama: userLogin?.nama || "Bapak Budi Santoso, M.Pd",
                  coTeacherNama: namaCoTeacherBaru,
                  peranCoTeacher: peranCoTeacherBaru,
                },
                ...daftarTimPengajar,
              ]);
              setNamaCoTeacherBaru("");
              alert("✓ Pengajar Pendamping (Co-Teacher) berhasil ditambahkan ke modul!");
            }}
            className="p-4 rounded-2xl bg-slate-50 border space-y-3 text-xs"
          >
            <select
              value={modulPilihCo}
              onChange={(e) => setModulPilihCo(e.target.value)}
              className="w-full p-2.5 border rounded-xl bg-white font-bold"
            >
              {semuaModul.map((m) => (
                <option key={m.id} value={m.judul}>
                  Modul: {m.judul}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={namaCoTeacherBaru}
                onChange={(e) => setNamaCoTeacherBaru(e.target.value)}
                placeholder="Nama Guru / Dosen Co-Teacher..."
                className="p-2.5 border rounded-xl bg-white font-bold"
              />
              <input
                type="text"
                value={peranCoTeacherBaru}
                onChange={(e) => setPeranCoTeacherBaru(e.target.value)}
                placeholder="Peran Tugas..."
                className="p-2.5 border rounded-xl bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> + Undang Co-Teacher Modul
            </button>
          </form>

          <div className="space-y-3">
            {daftarTimPengajar.map((tim) => (
              <div
                key={tim.id}
                className="p-4 rounded-2xl border bg-white space-y-1 text-xs"
              >
                <div className="font-black text-sm text-slate-900">{tim.judulModul}</div>
                <div className="text-slate-600">
                  Pengajar Utama: <b>{tim.pengajarUtama}</b> • Co-Teacher:{" "}
                  <b className="text-indigo-700">{tim.coTeacherNama}</b>
                </div>
                <div className="text-[11px] font-bold text-emerald-700">
                  Peran Kolaborasi: {tim.peranCoTeacher}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. AI Early Warning System (Analisis Prediktif Kesulitan Siswa) */}
        <div className="lg:col-span-6 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-100 text-rose-800">
              AI Predictive Early Warning System
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Deteksi Dini Siswa Berisiko
              Tertinggal
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              AI memindai siswa yang gagal mencapai nilai KKM berulang kali atau belum mengumpulkan
              tugas mendekati waktu tutup agar pengajar dapat mengirim intervensi bimbingan.
            </p>
          </div>

          <div className="space-y-3">
            {siswaBerisiko.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 text-xs"
              >
                <div className="flex justify-between items-center">
                  <div className="font-black text-sm text-slate-900">
                    {s.namaSiswa}{" "}
                    <span className="text-slate-500 font-bold">({s.kelas})</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase">
                    Risiko {s.tingkatRisiko}
                  </span>
                </div>

                <p className="text-rose-950 font-semibold flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{s.indikatorMasalah}</span>
                </p>

                <div className="flex justify-end">
                  {s.sudahIntervensi ? (
                    <span className="text-emerald-700 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Pesan Bimbingan &amp; Remedial Terkirim
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSiswaBerisiko(
                          siswaBerisiko.map((x) =>
                            x.id === s.id ? { ...x, sudahIntervensi: true } : x
                          )
                        );
                        kirimBroadcastNotif(
                          `🤝 Pendampingan Belajar Khusus untuk ${s.namaSiswa}`,
                          `Halo ${s.namaSiswa}, sistem mendeteksi Anda membutuhkan bantuan pada modul saat ini. Silakan gunakan fitur Mentor Sebaya atau Office Hours bersama Pengajar!`,
                          "tugas_deadline"
                        );
                        alert(
                          `✓ Notifikasi intervensi bimbingan berhasil dikirim ke ${s.namaSiswa}!`
                        );
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Kirim Intervensi &amp; Bimbingan AI
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. EKSPOR SILABUS & RPP KE FORMAT DOKUMEN STANDAR NASIONAL (.DOC / WORD) */}
      <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              National Curriculum Document Exporter
            </span>
            <h3 className="text-xl font-black mt-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Ekspor Silabus, RPP &amp; RPS ke
              Format Dokumen Standar Nasional (.DOC)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rppList.map((rpp) => (
            <div
              key={rpp.id}
              className="p-5 rounded-2xl bg-slate-50 border flex flex-col justify-between space-y-4 text-xs"
            >
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-black text-[10px]">
                  {rpp.kurikulum} • {rpp.jenjangKelas}
                </span>
                <h4 className="font-black text-base text-slate-900 pt-1">{rpp.judulRpp}</h4>
                <p className="text-slate-600">{rpp.ringkasanTujuan}</p>
              </div>

              <button
                type="button"
                onClick={() => handleUnduhRppDocStandarNasional(rpp)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4" /> Unduh Dokumen RPP Standar Nasional (.DOC)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};