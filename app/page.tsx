"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Heart, Sparkles, School, Compass, Code } from "lucide-react";
import confetti from "canvas-confetti";

export default function BerandaHibahIlmu() {
  // Fungsi untuk memunculkan animasi kembang api kertas saat tombol diklik
  const rayakanBelajar = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const daftarJenjang = [
    {
      nama: "TK & PAUD",
      deskripsi: "Belajar mengenal huruf, angka, warna, dan cerita bergambar penuh animasi.",
      warna: "bg-pink-500",
      warnaMuda: "bg-pink-50 border-pink-200 text-pink-700",
      ikon: <Sparkles className="w-8 h-8 text-pink-500" />,
    },
    {
      nama: "SD / MI",
      deskripsi: "Matematika dasar, IPA seru, Bahasa Indonesia, dan kuis interaktif.",
      warna: "bg-red-500",
      warnaMuda: "bg-red-50 border-red-200 text-red-700",
      ikon: <BookOpen className="w-8 h-8 text-red-500" />,
    },
    {
      nama: "SMP / MTs",
      deskripsi: "Rangkuman materi lengkap, latihan soal ujian, dan eksperimen visual.",
      warna: "bg-blue-600",
      warnaMuda: "bg-blue-50 border-blue-200 text-blue-700",
      ikon: <Compass className="w-8 h-8 text-blue-600" />,
    },
    {
      nama: "SMA / SMK",
      deskripsi: "Sains, Sosial, persiapan masuk kampus, serta keterampilan kejuruan.",
      warna: "bg-indigo-600",
      warnaMuda: "bg-indigo-50 border-indigo-200 text-indigo-700",
      ikon: <School className="w-8 h-8 text-indigo-600" />,
    },
    {
      nama: "Kuliah & Umum",
      deskripsi: "Pemrograman (Panda Kode), Teknik, Ekonomi, dan keahlian lintas jurusan.",
      warna: "bg-emerald-600",
      warnaMuda: "bg-emerald-50 border-emerald-200 text-emerald-700",
      ikon: <GraduationCap className="w-8 h-8 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      {/* Navigasi Atas */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white p-2 rounded-xl font-bold text-xl">
              🐼
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-emerald-700">
                HibahIlmu
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full ml-2 font-semibold">
                100% Gratis
              </span>
            </div>
          </div>

          <a
            href="#donasi"
            className="flex items-center gap-1.5 text-sm font-medium bg-amber-100 text-amber-800 px-4 py-2 rounded-full hover:bg-amber-200 transition"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            Donasi Sukarela
          </a>
        </div>
      </header>

      {/* Bagian Utama (Hero) */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Code className="w-4 h-4" /> Dipersembahkan oleh Panda Kode untuk Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Belajar Apa Saja, <br />
            <span className="text-emerald-600">Gratis Selamanya.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Platform pengabdian masyarakat untuk membantu pelajar dari jenjang TK, SD, SMP, SMA, hingga Perguruan Tinggi tanpa biaya berlangganan sepeser pun.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={rayakanBelajar}
            className="bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition text-lg"
          >
            🎉 Mulai Belajar Sekarang
          </motion.button>
        </motion.div>

        {/* Pilihan Jenjang Pendidikan */}
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
          Pilih Jenjang Pendidikanmu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daftarJenjang.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={rayakanBelajar}
              className={`cursor-pointer border-2 rounded-3xl p-6 transition shadow-sm hover:shadow-md bg-white`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${item.warnaMuda}`}>
                  {item.ikon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.nama}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {item.deskripsi}
              </p>
              <span className="text-sm font-bold text-emerald-600 inline-flex items-center gap-1">
                Buka Kelas →
              </span>
            </motion.div>
          ))}
        </div>

        {/* Kotak Donasi Sukarela & Transparansi Amal */}
        <div
          id="donasi"
          className="mt-20 bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl"
        >
          <Heart className="w-12 h-12 text-amber-300 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Murni Amal Jariyah & Pengabdian
          </h3>
          <p className="max-w-2xl mx-auto text-emerald-100 mb-6 leading-relaxed">
            Seluruh materi di <strong>hibahilmu.id</strong> dapat diakses tanpa syarat. Jika kamu memiliki rezeki lebih dan ingin ikut beramal membantu perpanjangan domain serta operasional pengembangan konten, kamu bisa berdonasi secara sukarela (Tidak Wajib).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => alert("Nantinya tombol ini dihubungkan ke link Saweria / QRIS kamu!")}
              className="bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition"
            >
              ☕ Dukungan Donasi Sukarela (QRIS)
            </button>
          </div>
        </div>
      </main>

      {/* Footer Bawah */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500 mt-12">
        <p>
          Dibuat sepenuh hati oleh <strong>Panda Kode</strong> • HibahIlmu.id
        </p>
        <p className="text-xs mt-1">
          Semoga menjadi ilmu yang bermanfaat bagi seluruh pelajar Indonesia.
        </p>
      </footer>
    </div>
  );
}