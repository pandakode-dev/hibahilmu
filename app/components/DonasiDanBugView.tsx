"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Bug,
  Copy,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  ShieldCheck,
  Wallet,
  Building2,
  Award,
} from "lucide-react";
import {
  KonfigurasiWeb,
  TransparansiDonasi,
  LaporanBugItem,
  AkunPengguna,
} from "../types";

interface DonasiDanBugProps {
  modeHalaman: "donasi" | "lapor_bug";
  userLogin: AkunPengguna | null;
  konfigurasiWeb: KonfigurasiWeb;
  dataDonasi: TransparansiDonasi;
  setDataDonasi: React.Dispatch<React.SetStateAction<TransparansiDonasi>>;
  daftarLaporanBug: LaporanBugItem[];
  onKirimLaporanBug: (laporanBaru: LaporanBugItem) => void;
  onKirimNotifDonasiKeAdmin: (namaDonatur: string, nominal: number, metode: string) => void;
  tambahXP: (xp: number) => void;
}

export const DonasiDanBugView: React.FC<DonasiDanBugProps> = ({
  modeHalaman,
  userLogin,
  konfigurasiWeb,
  dataDonasi,
  setDataDonasi,
  daftarLaporanBug,
  onKirimLaporanBug,
  onKirimNotifDonasiKeAdmin,
  tambahXP,
}) => {
  const [rekTersalinId, setRekTersalinId] = useState<string>("");

  // State Konfirmasi Donasi
  const [namaDonaturInput, setNamaDonaturInput] = useState(userLogin?.nama || "");
  const [nominalDonasiInput, setNominalDonasiInput] = useState<number>(50000);
  const [metodePilih, setMetodePilih] = useState(
    konfigurasiWeb.daftarRekeningDonasi[0]?.namaBankAtauEwallet || "DANA (Dompet Digital)"
  );
  const [pesanDoaInput, setPesanDoaInput] = useState("");
  const [suksesDonasi, setSuksesDonasi] = useState(false);

  // State Laporan Bug & Masukan
  const [namaPelaporInput, setNamaPelaporInput] = useState(userLogin?.nama || "");
  const [kontakPelaporInput, setKontakPelaporInput] = useState(userLogin?.email || "");
  const [kategoriBugInput, setKategoriBugInput] = useState<
    LaporanBugItem["kategoriLaporan"]
  >("Laporan Bug / Error Teknis");
  const [halamanTerkaitInput, setHalamanTerkaitInput] = useState("Ruang Belajar & Kuis Modul");
  const [deskripsiBugInput, setDeskripsiBugInput] = useState("");
  const [tampilkanKartuTerimaKasih, setTampilkanKartuTerimaKasih] = useState(false);

  const salinNomorRekening = (id: string, nomor: string) => {
    navigator.clipboard?.writeText(nomor);
    setRekTersalinId(id);
    setTimeout(() => setRekTersalinId(""), 2500);
  };

  // ============================================================================
  // 1. TAMPILAN MENU DONASI & WAKAF OPERASIONAL (MULTI-BANK, DANA, E-WALLET)
  // ============================================================================
  if (modeHalaman === "donasi") {
    const persenTerkumpul = Math.min(
      100,
      Math.round((dataDonasi.totalTerkumpul / (dataDonasi.targetTahunan || 1)) * 100)
    );

    return (
      <div className="space-y-10">
        {/* Hero Donasi Wakaf */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-10 rounded-[2.2rem] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
              <HeartHandshake className="w-4 h-4" /> Gerakan Wakaf &amp; Donasi Pendidikan Terbuka
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              100% Akses Belajar Gratis Selamanya, Didukung Gotong Royong Kita Bersama
            </h1>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Seluruh materi, modul berurutan, dan simulasi CBT di <b>HibahIlmu.id</b> adalah{" "}
              <b>100% gratis tanpa biaya langganan</b>. Bagi Anda yang ingin menyisihkan sebagian
              rezeki untuk mendukung biaya server, kuota beasiswa pelajar, dan apresiasi guru
              relawan, Anda dapat menyalurkannya melalui rekening resmi atau E-Wallet (DANA, GoPay,
              BSI, BCA, Mandiri) di bawah ini.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/10 border border-white/15 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-emerald-300 font-bold uppercase">
                  Total Dana Wakaf Terkumpul
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  Rp {dataDonasi.totalTerkumpul.toLocaleString("id-ID")}
                </div>
              </div>
              <span className="text-xs font-black bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg">
                {persenTerkumpul}% dari Target
              </span>
            </div>

            <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
              <div
                style={{ width: `${persenTerkumpul}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
              />
            </div>

            <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Laporan penggunaan dana transparan &amp; diperbarui secara berkala.</span>
            </div>
          </div>
        </div>

        {/* DAFTAR REKENING BANK & E-WALLET (DANA, GOPAY, BSI, BCA, MANDIRI) */}
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-end gap-2">
            <div>
              <span className="text-xs font-black uppercase text-emerald-700">
                METODE TRANSFER RESMI &amp; DOMPET DIGITAL
              </span>
              <h2 className="text-2xl font-black mt-1">
                Pilih Rekening Bank atau E-Wallet (DANA / GoPay / QRIS)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {konfigurasiWeb.daftarRekeningDonasi.map((rek) => {
              const sudahDisalin = rekTersalinId === rek.id;
              return (
                <div
                  key={rek.id}
                  className="bg-white text-slate-800 rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-2.5 w-full bg-gradient-to-r ${
                        rek.warnaTema || "from-indigo-600 to-emerald-600"
                      }`}
                    />
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {rek.logoUrl ? (
                            <img
                              src={rek.logoUrl}
                              alt={rek.namaBankAtauEwallet}
                              className="h-8 w-auto object-contain rounded"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
                              {rek.kategori === "E-Wallet" ? (
                                <Wallet className="w-5 h-5" />
                              ) : (
                                <Building2 className="w-5 h-5" />
                              )}
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {rek.kategori}
                            </span>
                            <h3 className="font-black text-base text-slate-900 mt-0.5">
                              {rek.namaBankAtauEwallet}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="text-[10px] font-black uppercase text-slate-400">
                          NOMOR REKENING / NOMOR AKUN
                        </div>
                        <div className="font-mono text-lg sm:text-xl font-black text-indigo-950 tracking-wide">
                          {rek.nomorRekening}
                        </div>
                        <div className="text-xs text-slate-600">
                          a.n. <b>{rek.atasNama}</b>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      type="button"
                      onClick={() => salinNomorRekening(rek.id, rek.nomorRekening)}
                      className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                        sudahDisalin
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {sudahDisalin ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Nomor Berhasil Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Salin Nomor Rekening / DANA
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FORM KONFIRMASI DONASI + INFORMASI KONTAK RESMI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Catat Konfirmasi Donasi &amp; Doa
              Kebaikan Anda
            </h3>

            {suksesDonasi && (
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-1">
                <div className="font-black text-base">
                  🎉 Jazakumullah Khairan / Terima Kasih Banyak atas Wakaf &amp; Donasi Anda!
                </div>
                <p className="text-xs">
                  Konfirmasi donasi Anda telah masuk ke notifikasi Admin dan tercatat di daftar
                  donatur publik. Semoga menjadi amal jariyah yang terus mengalir.
                </p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const namaFinal = namaDonaturInput.trim() || "Hamba Allah (Anonim)";
                const donasiBaru = {
                  id: "don-" + Date.now(),
                  namaDonatur: namaFinal,
                  nominal: nominalDonasiInput || 50000,
                  metodePembayaran: metodePilih,
                  pesan:
                    pesanDoaInput.trim() ||
                    "Semoga berkah untuk kemajuan pendidikan gratis Indonesia.",
                  waktu: "Baru saja",
                };
                setDataDonasi((prev) => ({
                  ...prev,
                  totalTerkumpul: prev.totalTerkumpul + (nominalDonasiInput || 50000),
                  riwayatDonatur: [donasiBaru, ...prev.riwayatDonatur],
                }));
                onKirimNotifDonasiKeAdmin(namaFinal, nominalDonasiInput || 50000, metodePilih);
                tambahXP(50);
                setPesanDoaInput("");
                setSuksesDonasi(true);
              }}
              className="space-y-4 text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nama Donatur (Boleh Hamba Allah / Anonim):
                  </label>
                  <input
                    type="text"
                    value={namaDonaturInput}
                    onChange={(e) => setNamaDonaturInput(e.target.value)}
                    placeholder="Nama Anda atau Hamba Allah..."
                    className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Nominal Donasi (Rp):
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={nominalDonasiInput}
                    onChange={(e) => setNominalDonasiInput(Number(e.target.value))}
                    className="w-full p-3.5 border rounded-xl bg-slate-50 font-black text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Metode Bank / E-Wallet Tujuan:
                </label>
                <select
                  value={metodePilih}
                  onChange={(e) => setMetodePilih(e.target.value)}
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                >
                  {konfigurasiWeb.daftarRekeningDonasi.map((r) => (
                    <option key={r.id} value={r.namaBankAtauEwallet}>
                      {r.namaBankAtauEwallet} — {r.nomorRekening} (a.n. {r.atasNama})
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={2}
                value={pesanDoaInput}
                onChange={(e) => setPesanDoaInput(e.target.value)}
                placeholder="Tuliskan pesan atau doa untuk para pelajar dan pengajar di HibahIlmu..."
                className="w-full p-3.5 border rounded-xl bg-slate-50"
              />

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-md cursor-pointer transition"
              >
                Kirim Konfirmasi Donasi &amp; Doa (+50 XP)
              </button>
            </form>
          </div>

          {/* Kolom Kanan: Kontak Resmi & Riwayat Donatur */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-7 rounded-3xl space-y-4">
              <h3 className="text-lg font-black">Hubungi Kontak Layanan Resmi</h3>
              <p className="text-xs text-slate-300">
                Jika memerlukan bukti tanda terima wakaf/donasi resmi atau kemitraan pendidikan,
                hubungi sekretariat kami:
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{konfigurasiWeb.nomorKontakWa}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{konfigurasiWeb.emailKontakResmi}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{konfigurasiWeb.alamatSekretariat}</span>
                </div>
              </div>
            </div>

            <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-3">
              <h3 className="font-black text-base">Doa &amp; Dukungan Donatur Terbaru</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {dataDonasi.riwayatDonatur.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border text-xs space-y-1">
                    <div className="flex justify-between font-black">
                      <span>{d.namaDonatur}</span>
                      <span className="text-emerald-700">
                        Rp {d.nominal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {d.metodePembayaran && (
                      <div className="text-[10px] font-bold text-indigo-600">
                        Via: {d.metodePembayaran}
                      </div>
                    )}
                    <p className="text-slate-600 italic">&ldquo;{d.pesan}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. TAMPILAN MENU LAPORAN BUG & MASUKAN (MASUK KE NOTIFIKASI ADMIN + UCAPAN TERIMA KASIH)
  // ============================================================================
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-8 sm:p-10 rounded-[2.2rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase">
            <Bug className="w-4 h-4" /> Pusat Laporan Bug, Koreksi Soal &amp; Saran Fitur
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            Bantu Kami Menyempurnakan HibahIlmu.id Bersama-Sama
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Menemukan kendala teknis (*bug*), tombol yang kurang responsif, atau punya ide fitur
            baru? Kirimkan masukan Anda di bawah ini. Laporan Anda akan <b>langsung masuk ke
            notifikasi Super Admin</b> dan Anda akan mendapatkan apresiasi <b>+35 XP</b>!
          </p>
        </div>
      </div>

      {/* KARTU UCAPAN TERIMA KASIH ISTIMEWA SETELAH MENGIRIM MASUKAN / LAPORAN BUG */}
      {tampilkanKartuTerimaKasih && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50 border-4 border-emerald-500 text-slate-900 shadow-2xl space-y-4 text-center">
          <Award className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
          <span className="bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase">
            Apresiasi Kontributor Masukan &amp; Bug Hunter (+35 XP)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Terima Kasih Banyak, {namaPelaporInput || userLogin?.nama || "Sahabat Pendidikan"}! 🙏
          </h2>
          <p className="text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Masukan dan laporan yang Anda kirimkan sangat berharga bagi kemajuan gerakan pendidikan
            gratis <b>HibahIlmu.id</b>. Laporan Anda telah diteruskan langsung ke <b>Kotak
            Notifikasi Super Admin</b> untuk segera ditindaklanjuti.
          </p>
          <button
            onClick={() => setTampilkanKartuTerimaKasih(false)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black cursor-pointer"
          >
            Kirim Masukan Lainnya
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Kirim Laporan Bug / Masukan */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-5 shadow-xs">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" /> Formulir Laporan Bug &amp; Masukan
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!deskripsiBugInput.trim()) return;
              const baru: LaporanBugItem = {
                id: "bug-" + Date.now(),
                pelaporNama: namaPelaporInput.trim() || userLogin?.nama || "Pengguna Anonim",
                pelaporRole: userLogin?.role || "umum",
                pelaporKontak:
                  kontakPelaporInput.trim() || userLogin?.email || "Tidak dicantumkan",
                kategoriLaporan: kategoriBugInput,
                halamanTerkait: halamanTerkaitInput,
                deskripsiDetail: deskripsiBugInput,
                waktuLapor: "Baru saja",
                status: "Baru Masuk",
              };
              onKirimLaporanBug(baru);
              setDeskripsiBugInput("");
              setTampilkanKartuTerimaKasih(true);
              tambahXP(35);
            }}
            className="space-y-4 text-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Nama Anda:
                </label>
                <input
                  type="text"
                  required
                  value={namaPelaporInput}
                  onChange={(e) => setNamaPelaporInput(e.target.value)}
                  placeholder="Nama Lengkap..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Nomor WhatsApp / Email (Jika Perlu Dihubungi Balik):
                </label>
                <input
                  type="text"
                  value={kontakPelaporInput}
                  onChange={(e) => setKontakPelaporInput(e.target.value)}
                  placeholder="Contoh: 0812xxxx / email@anda.com"
                  className="w-full p-3.5 border rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Kategori Laporan / Masukan:
                </label>
                <select
                  value={kategoriBugInput}
                  onChange={(e) =>
                    setKategoriBugInput(e.target.value as LaporanBugItem["kategoriLaporan"])
                  }
                  className="w-full p-3.5 border rounded-xl bg-indigo-50 font-black text-indigo-950"
                >
                  <option value="Laporan Bug / Error Teknis">🐞 Laporan Bug / Error Teknis</option>
                  <option value="Saran Fitur Baru">💡 Saran Fitur Baru</option>
                  <option value="Koreksi Materi / Soal">📖 Koreksi Materi / Kunci Soal</option>
                  <option value="Apresiasi & Masukan Umum">❤️ Apresiasi &amp; Masukan Umum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Bagian / Halaman Terkait:
                </label>
                <input
                  type="text"
                  value={halamanTerkaitInput}
                  onChange={(e) => setHalamanTerkaitInput(e.target.value)}
                  placeholder="Misal: Kuis Modul / Pop-up Bab / Tryout CBT..."
                  className="w-full p-3.5 border rounded-xl bg-slate-50 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Rincian Bug, Kendala, atau Saran Anda:
              </label>
              <textarea
                rows={4}
                required
                value={deskripsiBugInput}
                onChange={(e) => setDeskripsiBugInput(e.target.value)}
                placeholder="Ceritakan detail kendala yang Anda temukan atau ide pengembangan yang Anda harapkan..."
                className="w-full p-3.5 border rounded-xl bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg cursor-pointer transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Kirim Masukan ke Notifikasi Admin (+35 XP)
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Daftar Riwayat Masukan & Tanggapan Admin + Kontak */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white text-slate-800 p-7 rounded-3xl border space-y-4">
            <h3 className="font-black text-base">Log Laporan Bug &amp; Tindak Lanjut Admin</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {daftarLaporanBug.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-indigo-800">{item.kategoriLaporan}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        item.status === "Selesai Diperbaiki"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold">{item.deskripsiDetail}</p>
                  <div className="text-[11px] text-slate-400">
                    Oleh: <b>{item.pelaporNama}</b> • {item.waktuLapor}
                  </div>
                  {item.balasanAdmin && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold mt-1">
                      💬 Balasan Admin: {item.balasanAdmin}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 text-xs">
            <div className="font-black text-sm text-amber-300">Kontak Darurat Teknis Admin:</div>
            <div>📞 {konfigurasiWeb.nomorKontakWa}</div>
            <div>✉️ {konfigurasiWeb.emailKontakResmi}</div>
          </div>
        </div>
      </div>
    </div>
  );
};