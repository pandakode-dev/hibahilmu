"use client";

import React, { useState } from "react";
import {
  BrainCircuit,
  CloudRain,
  MessageSquareWarning,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  Smartphone,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import { ParameterFisikaInteraktif } from "./wokwiHardwareVisuals";

export interface PesanNotifikasiHp {
  id: string;
  waktu: string;
  platform: "Telegram Bot" | "WhatsApp Cloud";
  judul: string;
  isiPesan: string;
  tingkatBahaya: "INFO" | "WARNING" | "CRITICAL";
}

export const WokwiStage2AdvancedLabSuite: React.FC<{
  levelAktif: number;
  judulMateri: string;
  fisika: ParameterFisikaInteraktif;
  setFisika: React.Dispatch<React.SetStateAction<ParameterFisikaInteraktif>>;
  simulasiAktif: boolean;
  kodeKetikanUser: string;
  onSisipkanKodeChaosAtauAi: (tambahanKode: string) => void;
}> = ({
  levelAktif,
  judulMateri,
  fisika,
  setFisika,
  simulasiAktif,
  kodeKetikanUser,
  onSisipkanKodeChaosAtauAi,
}) => {
  const [tabTahap2, setTabTahap2] = useState<
    "chaos_mesh" | "smartphone_webhook" | "tinyml_edge_ai"
  >("chaos_mesh");

  // ==========================================================================
  // STATE FITUR #4: CHAOS & FAULT INJECTION (10-NODE SELF-HEALING & NOISE)
  // ==========================================================================
  const [cuacaBadaiAktif, setCuacaBadaiAktif] = useState<boolean>(false);
  const [nodeMatiSet, setNodeMatiSet] = useState<Set<number>>(new Set());
  const [injeksiNoiseSensor, setInjeksiNoiseSensor] = useState<boolean>(false);
  const [filterMovingAverageAktif, setFilterMovingAverageAktif] =
    useState<boolean>(false);

  // ==========================================================================
  // STATE FITUR #8: SMARTPHONE POPUP NOTIFIER (TELEGRAM / WHATSAPP WEBHOOK)
  // ==========================================================================
  const [tampilkanLayarHp, setTampilkanLayarHp] = useState<boolean>(true);
  const [riwayatChatHp, setRiwayatChatHp] = useState<PesanNotifikasiHp[]>([
    {
      id: "init-1",
      waktu: "08:00:00",
      platform: "Telegram Bot",
      judul: "🤖 HibahIlmu_IoT_Bot Connected",
      isiPesan:
        "Node ESP32 terhubung ke SSID HibahIlmu-Guest. Siap menerima webhook darurat sensor!",
      tingkatBahaya: "INFO",
    },
  ]);

  // Toggle matikan/hidupkan node tertentu (1..9) untuk menguji Self-Healing Routing
  const toggleMatikanNode = (nodeId: number) => {
    if (nodeId === 1 || nodeId === 10) return; // Node 1 (Hulu) & Node 10 (Gateway) tetap hidup sebagai ujung
    setNodeMatiSet((prev) => {
      const baru = new Set(prev);
      if (baru.has(nodeId)) baru.delete(nodeId);
      else baru.add(nodeId);
      return baru;
    });
  };

  // Hitung rute Self-Healing aktif dari Node 1 menuju Node 10 melewati node yang masih hidup!
  const ruteSelfHealingAktif: number[] = [];
  for (let n = 1; n <= 10; n++) {
    if (!nodeMatiSet.has(n)) {
      ruteSelfHealingAktif.push(n);
    }
  }

  const rssiRataRata = cuacaBadaiAktif ? -84 : -52;
  const packetDeliveryRatio = Math.max(
    45,
    100 -
      (cuacaBadaiAktif ? 18 : 0) -
      nodeMatiSet.size * 4 +
      (filterMovingAverageAktif ? 12 : 0)
  );

  // Fungsi mengirim pesan simulasi Webhook ke layar Smartphone
  const kirimNotifikasiKeHp = (
    platform: "Telegram Bot" | "WhatsApp Cloud"
  ) => {
    const jam = new Date().toTimeString().slice(0, 8);
    const bahayaGasAtauSuhu =
      fisika.kadarGasPpm >= 500 || fisika.suhuCelcius >= 35;

    const pesanBaru: PesanNotifikasiHp = {
      id: `msg-${Date.now()}`,
      waktu: jam,
      platform,
      judul: bahayaGasAtauSuhu
        ? `🚨 ALERT DARURAT LEVEL ${levelAktif}!`
        : `📊 Laporan Telemetri Level ${levelAktif}`,
      isiPesan: bahayaGasAtauSuhu
        ? `BAHAYA TERDETEKSI! Suhu: ${fisika.suhuCelcius}°C | Gas: ${fisika.kadarGasPpm} PPM | Cahaya: ${fisika.luxCahaya} Lux. Aktuator Pemadam/Kipas telah diaktifkan otomatis!`
        : `Status Normal ✓ Suhu: ${fisika.suhuCelcius}°C | Gas: ${fisika.kadarGasPpm} PPM | Jarak: ${fisika.jarakUltrasonikCm} cm | Rute Mesh: ${ruteSelfHealingAktif.join("➔")}`,
      tingkatBahaya: bahayaGasAtauSuhu ? "CRITICAL" : "INFO",
    };

    setRiwayatChatHp((prev) => [pesanBaru, ...prev.slice(0, 5)]);
    setTampilkanLayarHp(true);
  };

  // ==========================================================================
  // PERHITUNGAN FITUR #10: TINYML / EDGE AI MULTI-SENSOR INFERENCE ENGINE
  // ==========================================================================
  const skorSuhu = Math.max(0, Math.min(100, (fisika.suhuCelcius - 20) * 3.2));
  const skorGas = Math.max(0, Math.min(100, (fisika.kadarGasPpm - 150) / 8));
  const skorGelap = Math.max(
    0,
    Math.min(100, ((1000 - fisika.luxCahaya) / 1000) * 100)
  );
  const skorAnomaliGabungan = Math.round(
    skorSuhu * 0.4 + skorGas * 0.45 + skorGelap * 0.15
  );

  const kelasPrediksiAi =
    skorAnomaliGabungan >= 65
      ? {
          label: "🔴 ANOMALI KRITIS (BAHAYA KEBAKARAN / OVERHEAT)",
          warna: "bg-rose-950/60 border-rose-500 text-rose-200",
          rekomendasiAksi:
            "Aktifkan Pompa Air 100% Duty Cycle + Sirine Buzzer + Kirim Webhook Darurat!",
          dosisPupukAirMl: 450,
        }
      : skorAnomaliGabungan >= 35
      ? {
          label: "🟡 PERINGATAN DINI (STRES LINGKUNGAN / KERING)",
          warna: "bg-amber-950/60 border-amber-400 text-amber-200",
          rekomendasiAksi:
            "Nyalakan Kipas Exhaust PWM 65% + Irigasi Tetes Terjadwal.",
          dosisPupukAirMl: 220,
        }
      : {
          label: "🟢 KONDISI OPTIMAL (LAHAN & RUANGAN SEHAT)",
          warna: "bg-emerald-950/60 border-emerald-400 text-emerald-200",
          rekomendasiAksi:
            "Pertahankan Mode Hemat Energi (Deep Sleep) & Pantau Berkala.",
          dosisPupukAirMl: 50,
        };

  return (
    <div className="bg-slate-950 border-2 border-purple-500/40 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl text-xs">
      {/* Header Navigasi Fitur Tahap 2 */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-sm text-white">
            🚀 Fitur Lanjutan Tahap 2: Chaos Mesh Injection, Smartphone Webhook &amp; TinyML Edge AI
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTabTahap2("chaos_mesh")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabTahap2 === "chaos_mesh"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> 1. Chaos &amp; Self-Healing Mesh
          </button>

          <button
            type="button"
            onClick={() => setTabTahap2("smartphone_webhook")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabTahap2 === "smartphone_webhook"
                ? "bg-sky-500 text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> 2. Smartphone Telegram/WA Live
          </button>

          <button
            type="button"
            onClick={() => setTabTahap2("tinyml_edge_ai")}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabTahap2 === "tinyml_edge_ai"
                ? "bg-purple-500 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> 3. TinyML Edge AI ESP32
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1 (FITUR #4): CHAOS / FAULT INJECTION & SELF-HEALING 10-NODE    */}
      {/* =================================================================== */}
      {tabTahap2 === "chaos_mesh" && (
        <div className="space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <div className="font-extrabold text-amber-300">
                ⚡ Simulator Gangguan Lapangan (Chaos Engineering) &amp; Self-Healing Multi-Hop:
              </div>
              <div className="text-slate-400">
                Klik nomor Node (2..9) di bawah untuk mematikan node secara paksa dan lihat bagaimana jaringan ESP-NOW otomatis melompati node yang mati!
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCuacaBadaiAktif(!cuacaBadaiAktif)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border ${
                  cuacaBadaiAktif
                    ? "bg-amber-400 text-slate-950 border-white"
                    : "bg-slate-950 text-slate-300 border-slate-700"
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                {cuacaBadaiAktif
                  ? "⛈️ Hujan Badai: AKTIF (RSSI -84 dBm)"
                  : "☀️ Cuaca Cerah (RSSI -52 dBm)"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setInjeksiNoiseSensor(!injeksiNoiseSensor);
                  if (!injeksiNoiseSensor) {
                    setFisika((f) => ({
                      ...f,
                      jarakUltrasonikCm: Math.min(145, f.jarakUltrasonikCm + 35),
                      suhuCelcius: Number((f.suhuCelcius + 4.5).toFixed(1)),
                    }));
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border ${
                  injeksiNoiseSensor
                    ? "bg-rose-600 text-white border-rose-300"
                    : "bg-slate-950 text-slate-300 border-slate-700"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {injeksiNoiseSensor ? "📈 Sensor Noise: ON" : "Injeksi Noise Sensor"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterMovingAverageAktif(true);
                  onSisipkanKodeChaosAtauAi(
                    `\n// Filter Moving Average Anti-Noise & Auto Re-Route:\nint sampelBersih = (bacaan1 + bacaan2 + bacaan3) / 3;\n`
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> + Sisipkan Filter Anti-Noise
              </button>
            </div>
          </div>

          {/* Visualisasi Interaktif 10-Node Self-Healing Mesh */}
          <div className="bg-[#070b14] p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap justify-between items-center text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">
                🛰️ Rute Self-Healing Aktif:{" "}
                {ruteSelfHealingAktif.map((n) => `Node#${n}`).join(" ➔ ")}
              </span>
              <span className="text-amber-300">
                Sinyal: {rssiRataRata} dBm | Packet Delivery Ratio:{" "}
                <strong>{packetDeliveryRatio}%</strong>
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const nodeId = i + 1;
                const mati = nodeMatiSet.has(nodeId);
                return (
                  <button
                    key={nodeId}
                    type="button"
                    onClick={() => toggleMatikanNode(nodeId)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      mati
                        ? "bg-rose-950/70 border-rose-500 text-rose-300 opacity-65"
                        : nodeId === 10
                        ? "bg-amber-400 text-slate-950 font-black border-white"
                        : "bg-emerald-950/50 border-emerald-500/60 text-emerald-300 hover:border-white"
                    }`}
                  >
                    <div className="text-[10px] font-black">NODE #{nodeId}</div>
                    <div className="text-[9px] mt-0.5">
                      {mati
                        ? "💀 MATI (SKIP)"
                        : nodeId === 10
                        ? "🌐 GATEWAY"
                        : "✅ ONLINE"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2 (FITUR #8): SMARTPHONE POPUP NOTIFIER (TELEGRAM & WHATSAPP)   */}
      {/* =================================================================== */}
      {tabTahap2 === "smartphone_webhook" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-extrabold text-sky-300 text-sm">
              📱 Integrasi Webhook Notifikasi Smartphone (Telegram Bot &amp; WhatsApp Cloud API)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Uji pengiriman peringatan darurat secara langsung dari ESP32 ke layar smartphone! Saat suhu atau kadar gas melampaui batas aman, pesan peringatan akan otomatis masuk ke layar HP di sebelah kanan.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => kirimNotifikasiKeHp("Telegram Bot")}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Alert ke Telegram Bot
              </button>

              <button
                type="button"
                onClick={() => kirimNotifikasiKeHp("WhatsApp Cloud")}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Alert ke WhatsApp
              </button>

              <button
                type="button"
                onClick={() =>
                  onSisipkanKodeChaosAtauAi(
                    `\n// Kirim Notifikasi Darurat ke Smartphone Telegram Bot:\nSerial.println("[TELEGRAM WEBHOOK] Mengirim peringatan bahaya ke HP...");\n`
                  )
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> + Sisipkan Kode Webhook ke Editor
              </button>
            </div>
          </div>

          {/* Mockup Layar Smartphone Interaktif */}
          <div className="lg:col-span-5 bg-[#050811] border-4 border-slate-700 rounded-3xl p-3.5 space-y-2.5 shadow-2xl max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-[10px] text-slate-400 font-mono">
              <span>📶 5G HibahIlmu-Guest</span>
              <span className="font-bold text-emerald-400">📱 LAYAR HP PENGGUNA</span>
              <span>🔋 98%</span>
            </div>

            <div className="space-y-2">
              {riwayatChatHp.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-2xl border space-y-1 ${
                    msg.tingkatBahaya === "CRITICAL"
                      ? "bg-rose-950/70 border-rose-500 text-rose-100 animate-pulse"
                      : "bg-slate-900 border-slate-800 text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span
                      className={
                        msg.platform === "Telegram Bot"
                          ? "text-sky-400"
                          : "text-emerald-400"
                      }
                    >
                      {msg.platform} • {msg.judul}
                    </span>
                    <span className="text-slate-400 font-mono">{msg.waktu}</span>
                  </div>
                  <p className="text-[11px] leading-snug">{msg.isiPesan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3 (FITUR #10): TINYML / EDGE AI CLASSIFIER DI DALAM ESP32       */}
      {/* =================================================================== */}
      {tabTahap2 === "tinyml_edge_ai" && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <div className="font-extrabold text-purple-300 text-sm">
                🧠 Mesin Inferensi TinyML / Edge AI On-Device (Fusi 3 Sensor Sekaligus)
              </div>
              <div className="text-slate-400">
                Model AI ringan di dalam RAM ESP32 menggabungkan bobot Suhu ({fisika.suhuCelcius}°C), Gas ({fisika.kadarGasPpm} PPM), dan Cahaya ({fisika.luxCahaya} Lux) secara real-time!
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onSisipkanKodeChaosAtauAi(
                  `\n// Inferensi TinyML Edge AI di dalam ESP32:\nfloat aiScore = (suhu * 0.4) + (ppm * 0.05);\nSerial.printf("[TINYML EDGE AI] Skor Anomali: %.1f -> Status: %s\\n", aiScore, aiScore > 35 ? "BAHAYA" : "OPTIMAL");\n`
                )
              }
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Sisipkan Kode Inferensi TinyML ke Editor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1">
              <div className="text-[10px] text-slate-400">
                BOBOT INPUT NEURAL / TREE:
              </div>
              <div className="text-rose-300">
                • Fitur X1 (Suhu): {Math.round(skorSuhu)}/100
              </div>
              <div className="text-sky-300">
                • Fitur X2 (Gas PPM): {Math.round(skorGas)}/100
              </div>
              <div className="text-amber-300">
                • Fitur X3 (Gelap): {Math.round(skorGelap)}/100
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border-2 ${kelasPrediksiAi.warna} space-y-1 md:col-span-2`}>
              <div className="flex justify-between items-center font-black text-xs">
                <span>HASIL KLASIFIKASI AI: {kelasPrediksiAi.label}</span>
                <span className="font-mono">
                  Skor Risiko: {skorAnomaliGabungan}/100
                </span>
              </div>
              <div className="text-[11px]">
                <strong>🤖 Keputusan Otomatis ESP32:</strong>{" "}
                {kelasPrediksiAi.rekomendasiAksi}
              </div>
              <div className="text-[11px] font-mono text-amber-300">
                💧 Rekomendasi Dosis Pompa Air/Pupuk Presisi:{" "}
                <strong>{kelasPrediksiAi.dosisPupukAirMl} mL/menit</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};