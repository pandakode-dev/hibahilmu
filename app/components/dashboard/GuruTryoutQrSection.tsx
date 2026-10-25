"use client";

import React, { useState } from "react";
import { QrCode, Timer, ShieldCheck } from "lucide-react";
import {
  AkunPengguna,
  PaketTryout,
  PresensiItem,
  SoalTryout,
  KategoriTes,
  TipeUjianCBT,
} from "../../types";

interface GuruTryoutQrProps {
  userLogin: AkunPengguna;
  daftarPaketTryout: PaketTryout[];
  setDaftarPaketTryout: (list: PaketTryout[]) => void;
  daftarPresensi: PresensiItem[];
  setDaftarPresensi: React.Dispatch<React.SetStateAction<PresensiItem[]>>;
  soalTryoutDraft: SoalTryout[];
}

export const GuruTryoutQrSection: React.FC<GuruTryoutQrProps> = ({
  userLogin,
  daftarPaketTryout,
  setDaftarPaketTryout,
  daftarPresensi,
  setDaftarPresensi,
  soalTryoutDraft,
}) => {
  const [tokenQrInput, setTokenQrInput] = useState("");
  const [judulTryoutBaru, setJudulTryoutBaru] = useState("");
  const [kategoriTesBaru, setKategoriTesBaru] = useState<KategoriTes>("TPA");
  const [tipeUjianInput, setTipeUjianInput] = useState<TipeUjianCBT>("Pilihan Ganda");
  const [alamatTryoutBaru, setAlamatTryoutBaru] = useState(
    "Gedung CBT Center R.101 / Online Proctored"
  );
  const [durasiMenitInput, setDurasiMenitInput] = useState<number>(25);
  const [jadwalBukaSesiInput, setJadwalBukaSesiInput] = useState("2026-10-20T08:00");
  const [jadwalTutupSesiInput, setJadwalTutupSesiInput] = useState("2026-12-31T23:59");

  // Pengaturan Proteksi & Fitur CBT
  const [bolehMundurInput, setBolehMundurInput] = useState(false);
  const [izinkanKeyboardInput, setIzinkanKeyboardInput] = useState(false);
  const [pakaiCoratCoretInput, setPakaiCoratCoretInput] = useState(true);
  const [batasPelanggaranInput, setBatasPelanggaranInput] = useState<number>(3);
  const [wajibFullscreenInput, setWajibFullscreenInput] = useState(true);

  return (
    <div className="space-y-8">
      {/* Scanner QR Peserta */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-3xl space-y-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <QrCode className="w-6 h-6 text-amber-400" /> Scanner Token QR Kartu Ujian Peserta
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!tokenQrInput.trim()) return;
            const jam = new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });
            setDaftarPresensi([
              {
                id: "qr-" + Date.now(),
                siswaId: "sis-1",
                siswaNama: `Peserta Terverifikasi QR (${tokenQrInput.toUpperCase()})`,
                materiJudul: "Presensi Fisik Ruangan CBT via QR Code",
                waktuHadir: `${jam} WIB`,
                metode: "Scan QR Ujian",
              },
              ...daftarPresensi,
            ]);
            setTokenQrInput("");
            alert("✓ QR Code Valid! Kehadiran peserta ujian berhasil dicatat.");
          }}
          className="flex gap-3 max-w-xl"
        >
          <input
            type="text"
            required
            value={tokenQrInput}
            onChange={(e) => setTokenQrInput(e.target.value)}
            placeholder="Ketik / Scan Token QR Peserta (Misal: HIBAH-SIS-1-TPA)..."
            className="flex-1 p-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-sm"
          />
          <button
            type="submit"
            className="bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm cursor-pointer"
          >
            Verifikasi QR
          </button>
        </form>
      </div>

      {/* Form Rancang Paket Tryout CBT Lengkap */}
      <div className="bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-2xl font-black flex items-center gap-2">
            <Timer className="w-6 h-6 text-indigo-600" /> Rancang Sesi Ujian CBT Baru (
            {soalTryoutDraft.length} Soal di Draft)
          </h3>
          <span className="text-xs font-black bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full">
            Dilengkapi Jadwal Sesi, Kertas Corat-Coret &amp; Anti-Cheat
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!judulTryoutBaru.trim()) return;
            const baru: PaketTryout = {
              id: "pkt-" + Date.now(),
              judul: judulTryoutBaru,
              kategoriTes: kategoriTesBaru,
              jenjang: "SMA & Perguruan Tinggi",
              pembuatId: userLogin.id,
              pembuatNama: userLogin.nama,
              alamatLokasi: alamatTryoutBaru,
              jadwalUjian: `${jadwalBukaSesiInput.replace("T", " ")} s/d ${jadwalTutupSesiInput.replace("T", " ")}`,
              jadwalBukaSesi: jadwalBukaSesiInput,
              jadwalTutupSesi: jadwalTutupSesiInput,
              durasiMenit: durasiMenitInput || 25,
              tipeUjian: tipeUjianInput,
              bolehMundur: bolehMundurInput,
              izinkanKeyboard: izinkanKeyboardInput,
              pakaiCoratCoret: pakaiCoratCoretInput,
              batasPercobaan: 2,
              batasPelanggaran: batasPelanggaranInput || 3,
              wajibFullscreen: wajibFullscreenInput,
              daftarSoal: soalTryoutDraft,
            };
            setDaftarPaketTryout([baru, ...daftarPaketTryout]);
            setJudulTryoutBaru("");
            alert("✓ Paket Ujian CBT beserta aturan sesi dan proteksi berhasil diterbitkan!");
          }}
          className="space-y-5 text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              value={judulTryoutBaru}
              onChange={(e) => setJudulTryoutBaru(e.target.value)}
              placeholder="Nama Paket Ujian CBT..."
              className="p-3.5 border rounded-xl bg-slate-50 font-bold"
            />
            <select
              value={kategoriTesBaru}
              onChange={(e) => setKategoriTesBaru(e.target.value as KategoriTes)}
              className="p-3.5 border rounded-xl bg-indigo-50 font-black"
            >
              <option value="TPA">Kategori: TPA</option>
              <option value="TOEP">Kategori: TOEP</option>
              <option value="TOEFL">Kategori: TOEFL</option>
              <option value="UTBK">Kategori: UTBK SNBT</option>
              <option value="Akademik">Kategori: Ujian Akademik</option>
            </select>
            <select
              value={tipeUjianInput}
              onChange={(e) => setTipeUjianInput(e.target.value as TipeUjianCBT)}
              className="p-3.5 border rounded-xl bg-emerald-50 font-black text-emerald-950"
            >
              <option value="Pilihan Ganda">Tipe: Pilihan Ganda</option>
              <option value="Esai Komprehensif">Tipe: Esai Komprehensif</option>
              <option value="Campuran (PG + Esai)">Tipe: Campuran (PG + Esai)</option>
              <option value="CBT Algoritmik">Tipe: CBT Algoritmik</option>
            </select>
          </div>

          {/* Pengaturan Waktu Buka & Tutup Sesi Ujian */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border text-xs">
            <div>
              <label className="font-black text-slate-700 block mb-1">
                Waktu Sesi Ujian Dibuka:
              </label>
              <input
                type="datetime-local"
                value={jadwalBukaSesiInput}
                onChange={(e) => setJadwalBukaSesiInput(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white font-bold"
              />
            </div>
            <div>
              <label className="font-black text-slate-700 block mb-1">
                Waktu Sesi Ujian Ditutup:
              </label>
              <input
                type="datetime-local"
                value={jadwalTutupSesiInput}
                onChange={(e) => setJadwalTutupSesiInput(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-white font-bold"
              />
            </div>
            <div>
              <label className="font-black text-slate-700 block mb-1">
                Durasi Pengerjaan (Menit):
              </label>
              <input
                type="number"
                min={5}
                max={180}
                value={durasiMenitInput}
                onChange={(e) => setDurasiMenitInput(Number(e.target.value))}
                className="w-full p-2.5 border rounded-xl bg-white font-black"
              />
            </div>
            <div>
              <label className="font-black text-slate-700 block mb-1">
                Batas Maksimal Pelanggaran Tab:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={batasPelanggaranInput}
                onChange={(e) => setBatasPelanggaranInput(Number(e.target.value))}
                className="w-full p-2.5 border rounded-xl bg-white font-black text-rose-700"
              />
            </div>
          </div>

          {/* Checkbox Aturan Ujian: Corat-Coret, Navigasi Mundur, Keyboard, Fullscreen */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <div className="font-black text-xs uppercase text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Konfigurasi Aturan &amp; Alat
              Bantu Saat Ujian Berlangsung:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer">
                <input
                  type="checkbox"
                  checked={pakaiCoratCoretInput}
                  onChange={(e) => setPakaiCoratCoretInput(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span>✏️ Sediakan Kertas Corat-Coret</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer">
                <input
                  type="checkbox"
                  checked={bolehMundurInput}
                  onChange={(e) => setBolehMundurInput(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span>↩️ Izinkan Mundur ke Soal Sebelumnya</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer">
                <input
                  type="checkbox"
                  checked={izinkanKeyboardInput}
                  onChange={(e) => setIzinkanKeyboardInput(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span>⌨️ Izinkan Menekan Tombol Keyboard</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border cursor-pointer">
                <input
                  type="checkbox"
                  checked={wajibFullscreenInput}
                  onChange={(e) => setWajibFullscreenInput(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span>🖥️ Wajib Layar Penuh (Fullscreen)</span>
              </label>
            </div>
          </div>

          <input
            type="text"
            value={alamatTryoutBaru}
            onChange={(e) => setAlamatTryoutBaru(e.target.value)}
            placeholder="Lokasi Ruangan / Keterangan Pengawasan..."
            className="w-full p-3.5 border rounded-xl bg-slate-50"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl cursor-pointer shadow-lg"
          >
            Terbitkan Sesi Ujian CBT Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};