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
  BookOpen,
  Download,
  PlusCircle,
  Check,
  XCircle,
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
  // 1. STATE AI SMART FLASHCARD & QUIZ GENERATOR DARI VIDEO / PDF / JURNAL
  // ============================================================================
  const [sumberMateriTipe, setSumberMateriTipe] = useState<"pdf" | "video" | "jurnal">("pdf");
  const [judulSumberInput, setJudulSumberInput] = useState(
    "Arsitektur Pipeline Big Data (Kafka, Flume, Sqoop) & Q-Learning"
  );
  const [inputUrlAtauTeks, setInputUrlAtauTeks] = useState(
    "https://hibahilmu.id/repo/modul-komunikasi-data-dan-ai.pdf"
  );
  const [ringkasanEkstrakInput, setRingkasanEkstrakInput] = useState(
    "Protokol TCP/IP menjamin keandalan transmisi paket data melalui mekanisme Three-Way Handshake (SYN, SYN-ACK, ACK). Pada ekosistem Big Data, Apache Kafka menangani real-time event streaming, Apache Flume mengumpulkan log server, dan Apache Sqoop mentransfer data antara RDBMS dan HDFS. Sementara itu, Reinforcement Learning memperbarui nilai Q(s,a) berdasarkan reward lingkungan."
  );

  const [flashcardsHasilAi, setFlashcardsHasilAi] = useState<FlashcardItem[]>([
    {
      id: "fc-mm-1",
      depan: "Mekanisme Three-Way Handshake pada Protokol TCP",
      belakang:
        "Tahapan sinkronisasi koneksi tiga langkah: SYN → SYN-ACK → ACK sebelum transmisi paket data dimulai.",
      levelPenguasaan: "mahir",
    },
    {
      id: "fc-mm-2",
      depan: "Perbedaan Peran Apache Kafka, Flume, dan Sqoop",
      belakang:
        "Kafka: Real-time message broker | Flume: Ingest log streaming | Sqoop: Konektor RDBMS ke Hadoop HDFS.",
      levelPenguasaan: "cukup",
    },
    {
      id: "fc-mm-3",
      depan: "Prinsip Pembaruan Nilai pada Q-Learning (Reinforcement Learning)",
      belakang:
        "Agen memperbarui matriks Q(s,a) berdasarkan reward instan (r) dan estimasi nilai masa depan maksimum.",
      levelPenguasaan: "ulangi",
    },
  ]);

  const [indeksKartuAi, setIndeksKartuAi] = useState(0);
  const [balikKartuAi, setBalikKartuAi] = useState(false);

  const [kuisHasilAi, setKuisHasilAi] = useState<KuisItem[]>([
    {
      id: "qz-mm-1",
      tipe: "pilihan_ganda",
      tanya:
        "[AI Multi-modal Quiz #1] Urutan paket sinkronisasi pada proses Three-Way Handshake TCP yang tepat adalah...",
      opsi: [
        "SYN → SYN-ACK → ACK",
        "ACK → SYN → FIN",
        "UDP → TCP → HTTP",
        "SYN → FIN-ACK → RST",
      ],
      jawabanBenar: 0,
      pembahasan:
        "Koneksi TCP selalu diawali paket SYN oleh klien, direspons SYN-ACK oleh server, dan dikonfirmasi ACK.",
      poin: 40,
    },
    {
      id: "qz-mm-2",
      tipe: "pilihan_ganda",
      tanya:
        "[AI Multi-modal Quiz #2] Komponen ekosistem Apache manakah yang dirancang khusus untuk pertukaran data dua arah antara RDBMS (SQL) dan HDFS?",
      opsi: ["Apache Kafka", "Apache Flume", "Apache Sqoop", "Apache Storm"],
      jawabanBenar: 2,
      pembahasan:
        "Apache Sqoop (SQL-to-Hadoop) berfungsi mengekspor dan mengimpor tabel relasional ke penyimpanan HDFS.",
      poin: 40,
    },
  ]);

  const [jawabanKuisAi, setJawabanKuisAi] = useState<{ [id: string]: number }>({});
  const [skorSimulasiAi, setSkorSimulasiAi] = useState<number | null>(null);

  // ============================================================================
  // 2. STATE AI VOICE ASSISTANT / AUDIO TUTOR INTERAKTIF (WEB SPEECH API)
  // ============================================================================
  const [inputSuaraAtauTeks, setInputSuaraAtauTeks] = useState("");
  const [sedangMendengarkanMic, setSedangMendengarkanMic] = useState(false);
  const [sedangBicaraAi, setSedangBicaraAi] = useState(false);
  const [kecepatanSuara, setKecepatanSuara] = useState<number>(1.0);
  const [gayaBahasaTutor, setGayaBahasaTutor] = useState<
    "Socratic & Ramah" | "Akademik Mendalam" | "Analogi Sederhana"
  >("Socratic & Ramah");

  const [riwayatPercakapanSuara, setRiwayatPercakapanSuara] = useState<
    { id: string; pengirim: "Siswa" | "AI Voice Tutor"; teks: string; waktu: string }[]
  >([
    {
      id: "vc-1",
      pengirim: "AI Voice Tutor",
      teks: `Halo ${
        userLogin?.nama || "Sahabat Belajar"
      }! Saya AI Voice Tutor HibahIlmu. Pilih topik cepat di bawah, klik ikon mikrofon, atau ketik konsep yang ingin saya jelaskan secara lisan.`,
      waktu: "Baru saja",
    },
  ]);

  // Fungsi Ekstraksi Otomatis Multi-modal menjadi Flashcards & Kuis
  const handleGenerateMultiModal = () => {
    const teksUtama =
      ringkasanEkstrakInput.trim() ||
      "Konsep dasar pembelajaran meliputi pemahaman teori, penurunan rumus, dan pengujian studi kasus.";
    const kalimatList = teksUtama
      .split(".")
      .map((s) => s.trim())
      .filter((s) => s.length > 12);

    const kartuBaru: FlashcardItem[] = kalimatList.slice(0, 4).map((kal, idx) => ({
      id: `fc-gen-${Date.now()}-${idx}`,
      depan: `[${sumberMateriTipe.toUpperCase()}] Poin Inti #${idx + 1} — ${judulSumberInput.slice(
        0,
        38
      )}`,
      belakang: kal + ".",
      levelPenguasaan: "cukup",
    }));

    if (kartuBaru.length === 0) {
      kartuBaru.push({
        id: `fc-gen-${Date.now()}-0`,
        depan: `Inti Materi: ${judulSumberInput}`,
        belakang: teksUtama,
        levelPenguasaan: "cukup",
      });
    }

    const kuisBaru: KuisItem[] = [
      {
        id: `qz-gen-${Date.now()}-1`,
        tipe: "pilihan_ganda",
        tanya: `[AI Extracted #1] Berdasarkan sumber ${sumberMateriTipe.toUpperCase()} "${judulSumberInput}", manakah pernyataan utama yang paling akurat?`,
        opsi: [
          (kalimatList[0] || teksUtama).slice(0, 95) + ".",
          "Tidak memerlukan validasi parameter maupun pengujian empiris.",
          "Seluruh proses berjalan tanpa protokol sinkronisasi data.",
          "Hanya digunakan pada perangkat keras generasi pertama.",
        ],
        jawabanBenar: 0,
        pembahasan: `Sesuai ekstraksi kalimat pertama: ${kalimatList[0] || teksUtama}`,
        poin: 50,
      },
      {
        id: `qz-gen-${Date.now()}-2`,
        tipe: "pilihan_ganda",
        tanya: `[AI Extracted #2] Apa kesimpulan lanjutan yang dijelaskan pada dokumen/video "${judulSumberInput}" tersebut?`,
        opsi: [
          "Sistem mengabaikan umpan balik (reward) dari lingkungan.",
          (kalimatList[1] || kalimatList[0] || teksUtama).slice(0, 95) + ".",
          "Data tidak dapat ditransfer antar basis data relasional.",
          "Komunikasi jaringan selalu bersifat satu arah (simplex).",
        ],
        jawabanBenar: 1,
        pembahasan: `Sesuai ekstraksi bagian lanjutan: ${
          kalimatList[1] || kalimatList[0] || teksUtama
        }`,
        poin: 50,
      },
    ];

    setFlashcardsHasilAi(kartuBaru);
    setKuisHasilAi(kuisBaru);
    setIndeksKartuAi(0);
    setBalikKartuAi(false);
    setJawabanKuisAi({});
    setSkorSimulasiAi(null);
    tambahXP(35);
    alert(
      `✨ AI Multi-modal berhasil mengekstrak ${kartuBaru.length} Flashcard 3D & ${kuisBaru.length} Soal Kuis dari ${sumberMateriTipe.toUpperCase()} (+35 XP)!`
    );
  };

  const handleUnduhHasilEkstrakTxt = () => {
    const isi = [
      `HASIL EKSTRAKSI AI MULTI-MODAL HIBAHILMU.ID`,
      `Judul Sumber : ${judulSumberInput} (${sumberMateriTipe.toUpperCase()})`,
      `Tautan       : ${inputUrlAtauTeks}`,
      `\n--- DAFTAR FLASHCARD 3D ---`,
      ...flashcardsHasilAi.map((f, i) => `${i + 1}. Q: ${f.depan}\n   A: ${f.belakang}`),
      `\n--- DAFTAR KUIS EVALUASI ---`,
      ...kuisHasilAi.map(
        (k, i) =>
          `${i + 1}. ${k.tanya}\n   Kunci: ${k.opsi[k.jawabanBenar]}\n   Bahas: ${k.pembahasan}`
      ),
    ].join("\n");

    const blob = new Blob([isi], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Flashcard_Kuis_AI_${judulSumberInput.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  const ucapkanTeksAi = (teks: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Browser Anda belum mendukung fitur pembaca suara Web Speech API.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = "id-ID";
    u.rate = kecepatanSuara;
    u.onend = () => setSedangBicaraAi(false);
    setSedangBicaraAi(true);
    window.speechSynthesis.speak(u);
  };

  const handleSimulasiVoiceInput = () => {
    setSedangMendengarkanMic(true);
    setTimeout(() => {
      setSedangMendengarkanMic(false);
      setInputSuaraAtauTeks(
        "Jelaskan perbedaan arsitektur Apache Kafka, Flume, dan Sqoop serta kapan masing-masing digunakan!"
      );
    }, 1000);
  };

  const jawabPertanyaanDenganAi = (pertanyaanRaw: string) => {
    const tanya = pertanyaanRaw.trim();
    if (!tanya) return;

    let jawabanAi = "";
    const lower = tanya.toLowerCase();

    if (lower.includes("kafka") || lower.includes("flume") || lower.includes("sqoop")) {
      jawabanAi = `[Mode ${gayaBahasaTutor}]: Mari kita bedah ketiganya dengan jelas! Pertama, Apache Kafka adalah platform distributed event streaming berkecepatan tinggi untuk komunikasi data real-time antar microservices. Kedua, Apache Flume dirancang khusus untuk mengumpulkan dan mengalirkan data log dari banyak server ke HDFS. Ketiga, Apache Sqoop adalah jembatan dua arah untuk mentransfer data terstruktur antara database relasional (seperti MySQL/PostgreSQL) dan Hadoop HDFS.`;
    } else if (lower.includes("newton") || lower.includes("fisika") || lower.includes("energi")) {
      jawabanAi = `[Mode ${gayaBahasaTutor}]: Dalam mekanika klasik, Hukum II Newton menyatakan bahwa percepatan benda sebanding dengan resultan gaya yang bekerja dan berbanding terbalik dengan massanya (F = m dikali a). Sedangkan Energi Kinetik dihitung dengan setengah dikali massa dikali kuadrat kecepatan.`;
    } else if (lower.includes("judul") || lower.includes("abstrak") || lower.includes("jurnal")) {
      jawabanAi = `[Mode ${gayaBahasaTutor}]: Untuk optimasi publikasi ilmiah bereputasi, pastikan judul ringkas dan memuat variabel kunci, abstrak terstruktur mencakup latar belakang-metode-hasil-kesimpulan, serta keywords dipilih dari istilah standar IEEE atau MeSH agar mudah terindeks.`;
    } else {
      jawabanAi = `[Mode ${gayaBahasaTutor}]: Pertanyaan yang sangat bagus mengenai "${tanya.slice(
        0,
        65
      )}". Kunci utama menguasai topik ini adalah memetakan definisi dasar, menguji rumus atau protokolnya pada studi kasus nyata, lalu mengevaluasi pemahaman Anda melalui kuis bertahap.`;
    }

    setRiwayatPercakapanSuara((prev) => [
      ...prev,
      { id: "usr-" + Date.now(), pengirim: "Siswa", teks: tanya, waktu: "Baru saja" },
      { id: "ai-" + Date.now(), pengirim: "AI Voice Tutor", teks: jawabanAi, waktu: "Baru saja" },
    ]);
    setInputSuaraAtauTeks("");
    tambahXP(20);
    ucapkanTeksAi(jawabanAi);
  };

  const kartuAktif = flashcardsHasilAi[indeksKartuAi];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================================
            KOLOM KIRI (7 KOLOM): AI SMART FLASHCARD & QUIZ GENERATOR (MULTI-MODAL)
           ====================================================================== */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                Multi-Modal AI Learning Extractor
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1.5 flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-indigo-600" /> AI Flashcard 3D &amp; Quiz Generator
                dari PDF / Video / Jurnal
              </h3>
            </div>
            <button
              type="button"
              onClick={handleUnduhHasilEkstrakTxt}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Ringkasan (.TXT)
            </button>
          </div>

          {/* Pilihan Jenis Sumber */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "pdf", label: "📄 Dokumen PDF Modul", icon: <FileText className="w-4 h-4" /> },
              {
                id: "video",
                label: "🎬 Transkrip Video YouTube",
                icon: <Video className="w-4 h-4" />,
              },
              {
                id: "jurnal",
                label: "🔬 Paper / Jurnal Ilmiah IEEE",
                icon: <BookOpen className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSumberMateriTipe(tab.id as "pdf" | "video" | "jurnal")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition ${
                  sumberMateriTipe === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Form Input Ekstraksi Multi-modal */}
          <div className="space-y-3 text-xs sm:text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  Judul Materi / Paper / Video:
                </label>
                <input
                  type="text"
                  value={judulSumberInput}
                  onChange={(e) => setJudulSumberInput(e.target.value)}
                  placeholder="Judul dokumen atau video..."
                  className="w-full p-3 border rounded-xl bg-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                  Tautan File PDF / URL Video:
                </label>
                <input
                  type="text"
                  value={inputUrlAtauTeks}
                  onChange={(e) => setInputUrlAtauTeks(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 border rounded-xl bg-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                Paragraf Inti PDF / Abstrak Jurnal / Transkrip Video (Pisahkan dengan Titik):
              </label>
              <textarea
                rows={3}
                value={ringkasanEkstrakInput}
                onChange={(e) => setRingkasanEkstrakInput(e.target.value)}
                placeholder="Tempelkan teks materi atau transkrip video untuk diekstrak menjadi Flashcard & Kuis..."
                className="w-full p-3 border rounded-xl bg-white leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateMultiModal}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
            >
              <Sparkles className="w-4 h-4" /> ⚡ Ekstrak Jadi Set Flashcard 3D &amp; Kuis Otomatis
              (+35 XP)
            </button>
          </div>

          {/* Dek Kartu Flashcard 3D Hasil AI */}
          {kartuAktif && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4 shadow-lg">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="font-black text-amber-300 uppercase">
                  🧠 AI 3D Flashcard #{indeksKartuAi + 1} dari {flashcardsHasilAi.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {flashcardsHasilAi.map((fc, i) => (
                    <button
                      key={fc.id}
                      type="button"
                      onClick={() => {
                        setIndeksKartuAi(i);
                        setBalikKartuAi(false);
                      }}
                      className={`w-6 h-6 rounded-lg text-[11px] font-black cursor-pointer ${
                        indeksKartuAi === i
                          ? "bg-amber-400 text-slate-950"
                          : "bg-white/15 text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div
                onClick={() => setBalikKartuAi(!balikKartuAi)}
                className="min-h-[145px] p-6 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/20 flex flex-col items-center justify-center text-center cursor-pointer transition"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1.5">
                  {balikKartuAi ? "✨ JAWABAN / PENJELASAN INTI:" : "❓ KONSEP / PERTANYAAN:"}
                </span>
                <p className="font-black text-base sm:text-lg leading-snug">
                  {balikKartuAi ? kartuAktif.belakang : kartuAktif.depan}
                </p>
                <span className="text-[11px] text-slate-300 mt-3 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Klik kartu untuk membalik (Depan ↔ Belakang)
                </span>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-xs">
                <div className="flex gap-1.5">
                  {(["ulangi", "cukup", "mahir"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setFlashcardsHasilAi((prev) =>
                          prev.map((item, idx) =>
                            idx === indeksKartuAi ? { ...item, levelPenguasaan: lvl } : item
                          )
                        );
                        if (lvl === "mahir") tambahXP(10);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-black uppercase cursor-pointer ${
                        kartuAktif.levelPenguasaan === lvl
                          ? "bg-emerald-400 text-slate-950"
                          : "bg-white/10 text-slate-200"
                      }`}
                    >
                      {lvl === "ulangi" ? "Ulangi" : lvl === "cukup" ? "Cukup" : "Mahir (+10 XP)"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBalikKartuAi(false);
                    setIndeksKartuAi((prev) => (prev + 1) % flashcardsHasilAi.length);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black cursor-pointer"
                >
                  Kartu Selanjutnya →
                </button>
              </div>
            </div>
          )}

          {/* Daftar Kuis Multi-modal Hasil Ekstraksi */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-sm uppercase text-slate-600">
                📝 Kuis Interaktif Hasil Ekstraksi ({kuisHasilAi.length} Soal)
              </h4>
              {skorSimulasiAi !== null && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                  Skor Kuis Ekstraksi: {skorSimulasiAi}/100
                </span>
              )}
            </div>

            {kuisHasilAi.map((k, kIdx) => (
              <div
                key={k.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm"
              >
                <div className="font-black text-slate-900">
                  {kIdx + 1}. {k.tanya}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {k.opsi.map((op, idx) => {
                    const dipilih = jawabanKuisAi[k.id] === idx;
                    const benar = idx === k.jawabanBenar;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const baru = { ...jawabanKuisAi, [k.id]: idx };
                          setJawabanKuisAi(baru);
                          const jmlBenar = kuisHasilAi.filter(
                            (soal) => baru[soal.id] === soal.jawabanBenar
                          ).length;
                          setSkorSimulasiAi(
                            Math.round((jmlBenar / (kuisHasilAi.length || 1)) * 100)
                          );
                          if (benar) tambahXP(20);
                        }}
                        className={`p-3 rounded-xl border-2 text-left font-bold cursor-pointer flex items-center justify-between gap-2 transition ${
                          dipilih
                            ? benar
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                              : "bg-rose-50 border-rose-500 text-rose-950"
                            : "bg-white border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        <span>
                          <b>{String.fromCharCode(65 + idx)}.</b> {op}
                        </span>
                        {dipilih &&
                          (benar ? (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          ))}
                      </button>
                    );
                  })}
                </div>
                {jawabanKuisAi[k.id] !== undefined && (
                  <div className="p-3 rounded-xl bg-white border text-xs text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <b>Pembahasan AI:</b> {k.pembahasan}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================================
            KOLOM KANAN (5 KOLOM): AI VOICE ASSISTANT / AUDIO TUTOR INTERAKTIF
           ====================================================================== */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-7 sm:p-8 rounded-3xl flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
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
                  <VolumeX className="w-3.5 h-3.5" /> Hentikan Suara
                </button>
              )}
            </div>

            <h3 className="text-xl font-black flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" /> AI Voice Assistant (Audio Tutor Lisan)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mendukung tanya-jawab materi menggunakan suara mikrofon dan balasan penjelasan lisan
              otomatis dalam Bahasa Indonesia.
            </p>

            {/* Pengaturan Gaya Bahasa & Kecepatan Suara */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Gaya Penjelasan AI:
                </label>
                <select
                  value={gayaBahasaTutor}
                  onChange={(e) =>
                    setGayaBahasaTutor(
                      e.target.value as
                        | "Socratic & Ramah"
                        | "Akademik Mendalam"
                        | "Analogi Sederhana"
                    )
                  }
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="Socratic & Ramah">Socratic &amp; Ramah</option>
                  <option value="Akademik Mendalam">Akademik Mendalam</option>
                  <option value="Analogi Sederhana">Analogi Sederhana</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Kecepatan Suara (Rate):
                </label>
                <select
                  value={kecepatanSuara}
                  onChange={(e) => setKecepatanSuara(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value={0.85}>0.85x (Santai)</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={1.15}>1.15x (Cepat)</option>
                </select>
              </div>
            </div>

            {/* Tombol Pertanyaan Cepat */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-black uppercase text-slate-400">
                Klik Topik Cepat untuk Didengarkan:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Bedah Apache Kafka, Flume & Sqoop",
                  "Konsep Hukum II Newton & Energi",
                  "Tips Judul & Abstrak Jurnal Ilmiah",
                ].map((topik) => (
                  <button
                    key={topik}
                    type="button"
                    onClick={() => jawabPertanyaanDenganAi(topik)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600 text-[11px] font-bold text-left cursor-pointer transition"
                  >
                    🔊 {topik}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Log Percakapan Suara */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 my-2">
            {riwayatPercakapanSuara.map((item) => (
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
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Putar Suara
                    </button>
                  )}
                </div>
                <p className="leading-relaxed">{item.teks}</p>
              </div>
            ))}
          </div>

          {/* Input Suara & Teks */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jawabPertanyaanDenganAi(inputSuaraAtauTeks);
            }}
            className="space-y-2 pt-3 border-t border-slate-800"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSimulasiVoiceInput}
                className={`p-3.5 rounded-xl font-black text-xs flex items-center justify-center cursor-pointer shrink-0 ${
                  sedangMendengarkanMic
                    ? "bg-rose-600 text-white animate-ping"
                    : "bg-white/15 hover:bg-white/25 text-amber-300"
                }`}
                title="Klik untuk Bicara via Mikrofon"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputSuaraAtauTeks}
                onChange={(e) => setInputSuaraAtauTeks(e.target.value)}
                placeholder="Klik Mic atau ketik pertanyaan ke AI Voice Tutor..."
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