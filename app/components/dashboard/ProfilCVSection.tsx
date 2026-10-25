"use client";

import React, { useState } from "react";
import { Briefcase } from "lucide-react";
import { AkunPengguna, BiodataCV } from "../../types";

interface ProfilCVProps {
  userLogin: AkunPengguna;
  setUserLogin: (u: AkunPengguna) => void;
  daftarAkun: AkunPengguna[];
  setDaftarAkun: (list: AkunPengguna[]) => void;
}

export const ProfilCVSection: React.FC<ProfilCVProps> = ({
  userLogin,
  setUserLogin,
  daftarAkun,
  setDaftarAkun,
}) => {
  const [cvFoto, setCvFoto] = useState(userLogin.cv?.fotoUrl || "");
  const [cvHeadline, setCvHeadline] = useState(
    userLogin.cv?.headline || userLogin.infoTambahan || ""
  );
  const [cvSekolah, setCvSekolah] = useState(userLogin.cv?.asalSekolahKampus || "");
  const [cvPendidikan, setCvPendidikan] = useState(userLogin.cv?.pendidikanTerakhir || "");
  const [cvBioSingkat, setCvBioSingkat] = useState(userLogin.cv?.bioSingkat || "");
  const [cvSkillsTeks, setCvSkillsTeks] = useState(
    (userLogin.cv?.skills || []).join(", ")
  );
  const [cvPengalamanTeks, setCvPengalamanTeks] = useState(
    (userLogin.cv?.pengalaman || []).join("\n")
  );
  const [cvPrestasiTeks, setCvPrestasiTeks] = useState(
    (userLogin.cv?.prestasi || []).join("\n")
  );
  const [cvPortfolioUrl, setCvPortfolioUrl] = useState(userLogin.cv?.portfolioUrl || "");
  const [notifSimpanCV, setNotifSimpanCV] = useState(false);

  const daftarSkillPreview = cvSkillsTeks
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Kartu Preview Profil & CV */}
      <div className="lg:col-span-5 bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500" />
        <div className="px-7 pb-7 -mt-12 space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-3xl font-black text-slate-700">
            {cvFoto ? (
              <img src={cvFoto} alt={userLogin.nama} className="w-full h-full object-cover" />
            ) : (
              userLogin.nama.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900">{userLogin.nama}</h3>
            <p className="text-xs font-extrabold text-indigo-600 mt-0.5">
              {cvHeadline || userLogin.infoTambahan}
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {cvBioSingkat || "Belum ada deskripsi biodata singkat."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
            <div>
              <div className="font-black uppercase text-slate-400 text-[10px]">
                ASAL SEKOLAH / KAMPUS
              </div>
              <div className="font-bold text-slate-800 mt-0.5">
                {cvSekolah || "-"} ({cvPendidikan || "-"})
              </div>
            </div>

            <div>
              <div className="font-black uppercase text-slate-400 text-[10px] mb-1.5">
                SKILLS &amp; KEMAMPUAN
              </div>
              <div className="flex flex-wrap gap-1.5">
                {daftarSkillPreview.length > 0 ? (
                  daftarSkillPreview.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px]"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Form Edit Biodata & CV */}
      <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-5">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" /> Edit Foto Profil, Biodata &amp; CV
        </h3>
        {notifSimpanCV && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-sm font-bold">
            ✓ Perubahan Biodata dan CV berhasil disimpan!
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const cvBaru: BiodataCV = {
              fotoUrl: cvFoto,
              headline: cvHeadline,
              bioSingkat: cvBioSingkat,
              asalSekolahKampus: cvSekolah,
              pendidikanTerakhir: cvPendidikan,
              skills: daftarSkillPreview,
              pengalaman: cvPengalamanTeks
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
              prestasi: cvPrestasiTeks
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
              portfolioUrl: cvPortfolioUrl,
              karyaPublik: userLogin.cv?.karyaPublik || [],
            };
            const updated = { ...userLogin, infoTambahan: cvHeadline, cv: cvBaru };
            setUserLogin(updated);
            setDaftarAkun(daftarAkun.map((a) => (a.id === userLogin.id ? updated : a)));
            setNotifSimpanCV(true);
            setTimeout(() => setNotifSimpanCV(false), 2500);
          }}
          className="space-y-4 text-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="url"
              value={cvFoto}
              onChange={(e) => setCvFoto(e.target.value)}
              placeholder="URL Foto Profil (https://...)"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
            />
            <input
              type="text"
              value={cvHeadline}
              onChange={(e) => setCvHeadline(e.target.value)}
              placeholder="Headline / Spesialisasi"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={cvSekolah}
              onChange={(e) => setCvSekolah(e.target.value)}
              placeholder="Asal Sekolah / Universitas"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
            />
            <input
              type="text"
              value={cvPendidikan}
              onChange={(e) => setCvPendidikan(e.target.value)}
              placeholder="Tingkat / Pendidikan Terakhir"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
            />
          </div>

          <textarea
            rows={3}
            value={cvBioSingkat}
            onChange={(e) => setCvBioSingkat(e.target.value)}
            placeholder="Biodata singkat..."
            className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
          />

          <input
            type="text"
            value={cvSkillsTeks}
            onChange={(e) => setCvSkillsTeks(e.target.value)}
            placeholder="Keahlian / Skills (Pisahkan dengan koma)"
            className="w-full p-3.5 border border-slate-300 rounded-xl bg-white font-semibold"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              rows={2}
              value={cvPengalamanTeks}
              onChange={(e) => setCvPengalamanTeks(e.target.value)}
              placeholder="Pengalaman Mengajar / Organisasi (Pisahkan per baris)"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-xs"
            />
            <textarea
              rows={2}
              value={cvPrestasiTeks}
              onChange={(e) => setCvPrestasiTeks(e.target.value)}
              placeholder="Prestasi & Penghargaan (Pisahkan per baris)"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-xs"
            />
          </div>

          <input
            type="url"
            value={cvPortfolioUrl}
            onChange={(e) => setCvPortfolioUrl(e.target.value)}
            placeholder="URL Portofolio / LinkedIn / GitHub (https://...)"
            className="w-full p-3.5 border border-slate-300 rounded-xl bg-white"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-md cursor-pointer transition"
          >
            Simpan Perubahan Biodata &amp; CV
          </button>
        </form>
      </div>
    </div>
  );
};