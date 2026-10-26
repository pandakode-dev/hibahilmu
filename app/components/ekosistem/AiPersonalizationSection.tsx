"use client";

import React, { useState } from "react";
import {
  FileText,
  Video,
  Wand2,
  Mic,
  Volume2,
  VolumeX,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Send,
  Bot,
} from "lucide-react";
import { AkunPengguna, FlashcardItem, KuisItem } from "../../types";

interface AiPersonalizationProps {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

export const AiPersonalizationSection: React.FC<AiPersonalizationProps> = ({
  userLogin,
  tambahXP,
}) => {
  // ============================================================================
  // 1. STATE AI SMART FLASHCARD & QUIZ GENERATOR DARI VIDEO / PDF (MULTI-MODAL)
  // ============================================================================
  const [sumberMateriTipe, setSumberMateriTipe] = useState<"pdf" | "video">("pdf");
  const [inputUrlAtauTeks, setInputUrlAtauTeks] = useState(
    "https://arxiv.org/pdf/komunikasi-data-dan-reinforcement-learning.pdf"
  );
  const [ringkasanEkstrakInput, setRingkasanEkstrakInput] = useState(
    "Protokol TCP/IP menjamin keandalan transmisi paket data melalui mekanisme Three-Way Handshake (SYN, SYN-ACK, ACK), sedangkan algoritma Q-Learning memperbarui matriks nilai aksi berdasarkan reward lingkungan."
  );

  const [flashcardsHasilAi, setFlashcardsHasilAi] = useState<FlashcardItem[]>([
    {
      id: "fc-mm-1",
      depan: "[Ekstrak PDF/Video] Mekanisme Three-Way Handshake pada TCP",
      belakang: "Tahapan sinkronisasi koneksi: SYN → SYN-ACK → ACK sebelum transfer data dimulai.",
    },
    {
      id: "fc-mm-2",
      depan: "[Ekstrak PDF/Video] Inti Pembaruan Nilai pada Q-Learning",
      belakang: "Agen memperbarui nilai Q(s,a) berdasarkan reward instan (r) dan estimasi nilai masa depan maksimum.",
    },
  ]);
  const [indeksKartuAi, setIndeksKartuAi] = useState(0);
  const [balikKartuAi, setBalikKartuAi] = useState(false);

  const [kuisHasilAi, setKuisHasilAi] = useState<KuisItem[]>([
    {
      id: "qz-mm-1",
      tipe: "pilihan_ganda",
      tanya: "[AI Multi-modal Quiz] Berdasarkan ekstraksi materi di atas, urutan paket pada Three-Way Handshake TCP yang tepat adalah...",
      opsi: [
        "SYN → SYN-ACK → ACK",
        "ACK → SYN → FIN",
        "UDP → TCP → HTTP",
        "GET → POST → PUT",
      ],
      jawabanBenar: 0,
      pembahasan: "Three-Way Handshake selalu dimulai dengan SYN, dibalas SYN-ACK, dan dikonfirmasi dengan ACK.",
      poin: 40,
    },
  ]);
  const [jawabanKuisAi, setJawabanKuisAi] = useState<{ [id: string]: number }>({});

  // ============================================================================
  // 2. STATE AI VOICE ASSISTANT / AUDIO TUTOR INTERAKTIF
  // ============================================================================
  const [inputSuaraAtauTeks, setInputSuaraAtauTeks] = useState("");
  const [sedangMendengarkanMic, setSedangMendengarkanMic] = useState(false);
  const [sedangBicaraAi, setSedangBicaraAi] = useState(false);
  const [riwayatpercakapanSuara, setRiwayatPercakapanSuara] = useState<
    { id: string; pengirim: "Siswa" | "AI Voice Tutor"; teks: string; waktu: string }[]
  >([
    {
      id: "vc-1",
      pengirim: "AI Voice Tutor",
      teks: `Halo ${
        userLogin?.nama || "Sahabat Belajar"
      }! Saya AI Voice Tutor HibahIlmu. Anda bisa menekan tombol mikrofon atau mengetik konsep pelajaran yang ingin saya jelaskan dengan suara.`,
      waktu: "Baru saja",
    },
  ]);

  const handleGenerateMultiModal = () => {
    const potongan = ringkasanEkstrakInput.trim() || "Konsep Dasar Sains dan Teknologi";
    const fcBaru: FlashcardItem[] = [
      {
        id: "fc-mm-" + Date.now() + "-1",
        depan: `Konsep Utama dari ${sumberMateriTipe.toUpperCase()}`,
        belakang: potongan.slice(0, 120),
      },
      {
        id: "fc-mm-" + Date.now() + "-2",
        depan: "Sumber Referensi Multi-modal",
        belakang: `Diekstrak otomatis dari: ${inputUrlAtauTeks}`,
      },
    ];

    const qzBaru: KuisItem[] = [
      {
        id: "qz-mm-" + Date.now(),
        tipe: "pilihan_ganda",
        tanya: `[AI Multi-modal] Manakah pernyataan yang sesuai dengan isi ${sumberMateriTipe.toUpperCase()} yang baru saja diekstrak?`,
        opsi: [
          potongan.slice(0, 90) + "...",
          "Tidak memiliki hubungan dengan topik utama modul",
          "Hanya berlaku pada jaringan analog lama",
          "Semua variabel bernilai konstan nol",
        ],
        jawabanBenar: 0,
        pembahasan: `Sesuai dengan hasil ekstraksi dokumen/video: ${potongan}`,
        poin: 50,
      },
    ];

    setFlashcardsHasilAi(fcBaru);
    setKuisHasilAi(qzBaru);
    setIndeksKartuAi(0);
    setBalikKartuAi(false);
    tambahXP(35);
    alert(
      "✨ AI Multi-modal berhasil mengekstrak sumber materi menjadi Flashcard 3D & Soal Kuis (+35 XP)!"
    );
  };

  const ucapkanTeksAi = (teks: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = "id-ID";
    u.rate = 1.0;
    u.onend = () => setSedangBicaraAi(false);
    setSedangBicaraAi(true);
    window.speechSynthesis.speak(u);
  };

  const handleSimulasiVoiceInput = () => {
    setSedangMendengarkanMic(true);
    setTimeout(() => {
      setSedangMendengarkanMic(false);
      setInputSuaraAtauTeks(
        "Tolong jelaskan secara singkat perbedaan antara TCP dan UDP beserta contoh penggunaannya!"
      );
    }, 1200);
  };

  const handleKirimPertanyaanVoiceTutor = (e: React.FormEvent) => {
    e.preventDefault();
    const tanya = inputSuaraAtauTeks.trim();
    if (!tanya) return;

    const balasanAi = `Penjelasan Singkat AI Tutor: Mengenai "${tanya.slice(
      0,
      60
    )}", konsep utamanya adalah memahami cara kerja protokol dan rumus dasarnya secara bertahap. Misalnya pada jaringan komputer, TCP mengutamakan keandalan data (seperti pengiriman dokumen), sedangkan UDP mengutamakan kecepatan real-time (seperti live streaming dan panggilan video).`;

    setRiwayatPercakapanSuara((prev) => [
      ...prev,
      { id: "u-" + Date.now(), pengirim: "Siswa", teks: tanya, waktu: "Baru saja" },
      {
        id: "ai-" + Date.now(),
        pengirim: "AI Voice Tutor",
        teks: balasanAi,
        waktu: "Baru saja",
      },
    ]);
    setInputSuaraAtauTeks("");
    tambahXP(20);
    ucapkanTeksAi(balasanAi);
  };

  const kartuAktif = flashcardsHasilAi[indeksKartuAi];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* KOLOM KIRI: AI MULTI-MODAL FLASHCARD & QUIZ GENERATOR DARI VIDEO/PDF */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-8 rounded-3xl border space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                Multi-Modal AI Learning Extractor
              </span>
              <h3 className="text-xl font-black mt-1 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" /> AI Smart Flashcard &amp; Quiz
                Generator dari PDF / Video
              </h3>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSumberMateriTipe("pdf")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                sumberMateriTipe === "pdf"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <FileText className="w-4 h-4" /> Ekstrak dari Dokumen PDF / Jurnal
            </button>
            <button
              type="button"
              onClick={() => setSumberMateriTipe("video")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                sumberMateriTipe === "video"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <Video className="w-4 h-4" /> Ekstrak dari Transkrip Video YouTube
            </button>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <input
              type="text"
              value={inputUrlAtauTeks}
              onChange={(e) => setInputUrlAtauTeks(e.target.value)}
              placeholder={
                sumberMateriTipe === "pdf"
                  ? "Masukkan Link File PDF / Judul Jurnal..."
                  : "Masukkan Link Video Pembelajaran YouTube..."
              }
              className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
            />
            <textarea
              rows={2}
              value={ringkasanEkstrakInput}
              onChange={(e) => setRingkasanEkstrakInput(e.target.value)}
              placeholder="Tempelkan kutipan paragraf PDF atau transkrip inti video di sini untuk dikonversi AI..."
              className="w-full p-3 border rounded-xl bg-slate-50"
            />
            <button
              type="button"
              onClick={handleGenerateMultiModal}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> ⚡ Konversi Otomatis Jadi Flashcard 3D &amp; Kuis
              Interaktif (+35 XP)
            </button>
          </div>

          {/* Preview Hasil Flashcard 3D AI */}
          {kartuAktif && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-amber-300">
                  Hasil Flashcard 3D #{indeksKartuAi + 1} dari {flashcardsHasilAi.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setIndeksKartuAi((prev) => (prev + 1) % flashcardsHasilAi.length)
                  }
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold cursor-pointer"
                >
                  Kartu Berikutnya →
                </button>
              </div>

              <div
                onClick={() => setBalikKartuAi(!balikKartuAi)}
                className="min-h-[120px] p-5 rounded-xl bg-white/10 border border-white/20 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase text-emerald-300 mb-1">
                  {balikKartuAi ? "✨ JAWABAN / INTI MATERI:" : "❓ PERTANYAAN / KONSEP:"}
                </span>
                <p className="font-black text-base">{balikKartuAi ? kartuAktif.belakang : kartuAktif.depan}</p>
                <span className="text-[11px] text-slate-300 mt-2 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Klik untuk membalik kartu
                </span>
              </div>
            </div>
          )}

          {/* Preview Hasil Kuis AI Multi-modal */}
          {kuisHasilAi.map((k) => (
            <div key={k.id} className="p-5 rounded-2xl bg-slate-50 border space-y-3 text-xs">
              <div className="font-black text-indigo-900">{k.tanya}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {k.opsi.map((op, idx) => {
                  const dipilih = jawabanKuisAi[k.id] === idx;
                  const benar = idx === k.jawabanBenar;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setJawabanKuisAi({ ...jawabanKuisAi, [k.id]: idx });
                        if (benar) tambahXP(25);
                      }}
                      className={`p-3 rounded-xl border text-left font-bold cursor-pointer ${
                        dipilih
                          ? benar
                            ? "bg-emerald-100 border-emerald-500 text-emerald-950"
                            : "bg-rose-100 border-rose-500 text-rose-950"
                          : "bg-white"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {op}
                    </button>
                  );
                })}
              </div>
              {jawabanKuisAi[k.id] !== undefined && (
                <div className="p-2.5 rounded-xl bg-white border text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{k.pembahasan}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* KOLOM KANAN: AI VOICE ASSISTANT / AUDIO TUTOR INTERAKTIF */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                Interactive Voice AI Tutor
              </span>
              {sedangBicaraAi && (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                    }
                    setSedangBicaraAi(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center gap-1 cursor-pointer animate-pulse"
                >
                  <VolumeX className="w-3.5 h-3.5" /> Hentikan Suara AI
                </button>
              )}
            </div>

            <h3 className="text-xl font-black flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" /> Asisten Suara AI (Audio Tutor
              Tanya-Jawab Lisan)
            </h3>
            <p className="text-xs text-slate-300">
              Tanyakan konsep pelajaran apa saja menggunakan mikrofon atau teks, dan dengarkan
              penjelasan lisan langsung dari AI Voice Tutor.
            </p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {riwayatpercakapanSuara.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                  item.pengirim === "AI Voice Tutor"
                    ? "bg-white/10 border border-white/15 text-slate-100"
                    : "bg-indigo-600 text-white ml-6"
                }`}
              >
                <div className="flex justify-between items-center font-black">
                  <span className="text-amber-300">{item.pengirim}</span>
                  {item.pengirim === "AI Voice Tutor" && (
                    <button
                      type="button"
                      onClick={() => ucapkanTeksAi(item.teks)}
                      className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Putar Suara
                    </button>
                  )}
                </div>
                <p className="leading-relaxed">{item.teks}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleKirimPertanyaanVoiceTutor} className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSimulasiVoiceInput}
                className={`p-3.5 rounded-xl font-black text-xs flex items-center justify-center cursor-pointer shrink-0 ${
                  sedangMendengarkanMic
                    ? "bg-rose-600 text-white animate-ping"
                    : "bg-white/15 hover:bg-white/25 text-amber-300"
                }`}
                title="Gunakan Suara Mikrofon"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputSuaraAtauTeks}
                onChange={(e) => setInputSuaraAtauTeks(e.target.value)}
                placeholder="Klik ikon Mic atau ketik pertanyaan ke AI Voice Tutor..."
                className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Tanya
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};