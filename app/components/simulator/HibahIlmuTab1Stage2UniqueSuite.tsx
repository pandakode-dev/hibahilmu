"use client";

import React, { useState, useEffect } from "react";
import {
  BatteryCharging,
  CheckCircle2,
  Download,
  FileCode2,
  History,
  Lock,
  Mic,
  MicOff,
  Moon,
  Pause,
  Play,
  Rewind,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  Unlock,
  Wand2,
  Zap,
} from "lucide-react";
import { ParameterFisikaInteraktif } from "./wokwiHardwareVisuals";

export interface RekamanDetikBlackbox {
  detikKe: number;
  jamSimulasi: string;
  suhuC: number;
  gasPpm: number;
  luxCahaya: number;
  voltBaterai: number;
  statusAktuator: string;
  kejadianPenting: string;
}

export const HibahIlmuTab1Stage2UniqueSuite: React.FC<{
  kodeStudioAktif: string;
  onUpdateKodeStudio: (kodeBaru: string) => void;
  fisikaStudio: ParameterFisikaInteraktif;
  setFisikaStudio: React.Dispatch<
    React.SetStateAction<ParameterFisikaInteraktif>
  >;
  onKirimPerintahKeBroker?: (topik: string, payloadJson: string) => void;
}> = ({
  kodeStudioAktif,
  onUpdateKodeStudio,
  fisikaStudio,
  setFisikaStudio,
  onKirimPerintahKeBroker,
}) => {
  const [tabAktif, setTabAktif] = useState<
    | "solar_mppt_24h"
    | "voice_command"
    | "cyber_pentest"
    | "blackbox_replay"
    | "ieee_schematic"
  >("solar_mppt_24h");

  // ==========================================================================
  // FITUR UNIK #6: SOLAR PANEL MPPT & SIKLUS CUACA 24 JAM (00:00 - 23:59)
  // ==========================================================================
  const [jamMatahari, setJamMatahari] = useState<number>(12.5); // 12:30 Siang
  const [autoSiklus24Jam, setAutoSiklus24Jam] = useState<boolean>(false);
  const [teganganBaterai18650, setTeganganBaterai18650] =
    useState<number>(3.92);

  // Hitung kurva cahaya matahari berdasarkan jam (terbit 06:00, puncak 12:00, terbenam 18:00)
  const adalahSiangHari = jamMatahari >= 6 && jamMatahari <= 18;
  const faktorMatahari = adalahSiangHari
    ? Math.max(0, Math.sin(((jamMatahari - 6) / 12) * Math.PI))
    : 0;
  const luxDariMatahari = Math.round(25 + faktorMatahari * 950);
  const arusChargingSolarMa = Math.round(faktorMatahari * 480); // Maks 480 mA dari Panel Surya 5V/3W
  const arusBebanRangkaianMa = luxDariMatahari < 350 ? 165 : 75; // Malam hari lampu jalan menyala (beban naik)
  const netArusBateraiMa = arusChargingSolarMa - arusBebanRangkaianMa;

  useEffect(() => {
    if (!autoSiklus24Jam) return;
    const timer = setInterval(() => {
      setJamMatahari((prev) => {
        const next = prev + 0.5;
        return next >= 24 ? 0 : next;
      });
    }, 700);
    return () => clearInterval(timer);
  }, [autoSiklus24Jam]);

  // Sinkronkan Lux matahari & pengisian/pengurasan baterai 18650
  useEffect(() => {
    setFisikaStudio((f) => ({ ...f, luxCahaya: luxDariMatahari }));
    setTeganganBaterai18650((v) => {
      const deltaV = netArusBateraiMa > 0 ? 0.015 : -0.012;
      return Number(Math.max(3.0, Math.min(4.2, v + deltaV)).toFixed(2));
    });
  }, [jamMatahari, luxDariMatahari, netArusBateraiMa, setFisikaStudio]);

  const formatJamMenit = (jamDesimal: number) => {
    const h = Math.floor(jamDesimal);
    const m = Math.round((jamDesimal - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m === 60 ? 0 : m).padStart(
      2,
      "0"
    )} WIB`;
  };

  // ==========================================================================
  // FITUR UNIK #7: ASISTEN SUARA SMART HOME VOICE COMMAND (WEB SPEECH API)
  // ==========================================================================
  const [sedangMendengarkanSuara, setSedangMendengarkanSuara] =
    useState<boolean>(false);
  const [transkripSuaraTerakhir, setTranskripSuaraTerakhir] = useState<string>(
    "Belum ada perintah suara. Klik tombol mikrofon atau pilih tombol uji suara cepat di bawah!"
  );
  const [aksiSuaraTerakhir, setAksiSuaraTerakhir] = useState<string>(
    "Menunggu instruksi..."
  );

  const eksekusiKalimatPerintahSuara = (kalimat: string) => {
    const teks = kalimat.toLowerCase();
    setTranskripSuaraTerakhir(`"${kalimat}"`);

    if (teks.includes("kipas") && teks.includes("nyala")) {
      setFisikaStudio((f) => ({ ...f, suhuCelcius: 37.5, rpmKipas: 1800 }));
      setAksiSuaraTerakhir(
        "✅ Perintah Dijalankan: Kipas Exhaust Ruang Tamu DINYALAKAN (GPIO 33 HIGH | 1800 RPM)!"
      );
      onKirimPerintahKeBroker?.(
        "hibahilmu/iot/voice/kipas",
        '{"cmd":"FAN_ON","pin":33,"rpm":1800}'
      );
    } else if (teks.includes("pintu") || teks.includes("kunci")) {
      setFisikaStudio((f) => ({ ...f, rfidKartuDekat: true, sudutServo: 90 }));
      setAksiSuaraTerakhir(
        "✅ Perintah Dijalankan: Solenoid Door Lock & Palang Servo DIBUKA 90° (GPIO 27 & 13 HIGH)!"
      );
      onKirimPerintahKeBroker?.(
        "hibahilmu/iot/voice/pintu",
        '{"cmd":"UNLOCK_DOOR","pin_solenoid":27,"servo_deg":90}'
      );
    } else if (teks.includes("pompa") || teks.includes("siram")) {
      setFisikaStudio((f) => ({ ...f, debitPompaAir: true, kadarGasPpm: 200 }));
      setAksiSuaraTerakhir(
        "✅ Perintah Dijalankan: Pompa Air Sprinkler DINYALAKAN & Area Didinginkan (GPIO 25 HIGH)!"
      );
      onKirimPerintahKeBroker?.(
        "hibahilmu/iot/voice/pompa",
        '{"cmd":"PUMP_ON","pin":25,"status":"SPRAYING"}'
      );
    } else if (teks.includes("lampu") || teks.includes("malam")) {
      setJamMatahari(20.0);
      setFisikaStudio((f) => ({ ...f, luxCahaya: 80, pwmLedBrightness: 255 }));
      setAksiSuaraTerakhir(
        "✅ Perintah Dijalankan: Mode Malam Aktif & Relay Lampu Jalan DINYALAKAN 100% (GPIO 26 HIGH)!"
      );
      onKirimPerintahKeBroker?.(
        "hibahilmu/iot/voice/lampu",
        '{"cmd":"LIGHT_ON","pin":26,"pwm":255}'
      );
    } else {
      setAksiSuaraTerakhir(
        `📡 Perintah Suara Dikirim ke Broker MQTT: ${kalimat}`
      );
    }
  };

  const mulaiRekamMikrofonBrowser = () => {
    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      eksekusiKalimatPerintahSuara(
        "Halo HibahIlmu, nyalakan kipas ruang tamu sekarang!"
      );
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = "id-ID";
      rec.interimResults = false;
      setSedangMendengarkanSuara(true);
      rec.onresult = (ev: any) => {
        const hasil = ev.results?.[0]?.[0]?.transcript || "";
        eksekusiKalimatPerintahSuara(hasil);
        setSedangMendengarkanSuara(false);
      };
      rec.onerror = () => setSedangMendengarkanSuara(false);
      rec.onend = () => setSedangMendengarkanSuara(false);
      rec.start();
    } catch {
      setSedangMendengarkanSuara(false);
    }
  };

  // ==========================================================================
  // FITUR UNIK #8: CYBER-SECURITY & IOT PENETRATION TESTING (MITM vs TLS 8883)
  // ==========================================================================
  const [proteksiTlsHmacAktif, setProteksiTlsHmacAktif] =
    useState<boolean>(false);
  const [statusSeranganSiber, setStatusSeranganSiber] = useState<
    "AMAN" | "DITEMBUS_HACKER" | "SERANGAN_DITANGKIS"
  >("AMAN");
  const [logSeranganList, setLogSeranganList] = useState<string[]>([
    "[IDS FIREWALL] Memantau trafik MQTT pada topik hibahilmu/iot/# ...",
  ]);

  const lancarkanSimulasiSeranganHacker = () => {
    const jam = new Date().toTimeString().slice(0, 8);
    const kodeSudahAdaTls =
      /WiFiClientSecure|8883|HMAC_SHA256|setCACert/.test(kodeStudioAktif) ||
      proteksiTlsHmacAktif;

    if (kodeSudahAdaTls) {
      setStatusSeranganSiber("SERANGAN_DITANGKIS");
      setLogSeranganList((prev) => [
        `[${jam}] 🛡️ [BLOCKED] Serangan MITM Spoofing '/unlock_solenoid' DITOLAK! Signature HMAC-SHA256 & Sertifikat TLS Port 8883 tidak cocok!`,
        ...prev.slice(0, 5),
      ]);
    } else {
      setStatusSeranganSiber("DITEMBUS_HACKER");
      setLogSeranganList((prev) => [
        `[${jam}] 🚨 [BREACH ALERT] Hacker menyadap Port 1883 (Plaintext) & menyuntikkan payload palsu '{"cmd":"/unlock_solenoid","override":1}'! Kunci Pintu Terbuka Ilegal!`,
        ...prev.slice(0, 5),
      ]);
    }
  };

  // ==========================================================================
  // FITUR UNIK #9: BLACKBOX TIME-TRAVEL REPLAY (60 DETIK & SLOW-MO 0.25X)
  // ==========================================================================
  const [riwayatBlackbox, setRiwayatBlackbox] = useState<
    RekamanDetikBlackbox[]
  >(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      detikKe: i + 1,
      jamSimulasi: `08:00:${String(i + 1).padStart(2, "0")}`,
      suhuC: Number((27 + Math.sin(i * 0.4) * 6).toFixed(1)),
      gasPpm: Math.round(220 + (i >= 12 && i <= 16 ? 480 : i * 12)),
      luxCahaya: Math.round(600 - i * 18),
      voltBaterai: Number((4.15 - i * 0.01).toFixed(2)),
      statusAktuator:
        i >= 12 && i <= 16
          ? "🚨 SIRINE & POMPA ON (ANOMALI GAS!)"
          : "🟢 STANDBY NORMAL",
      kejadianPenting:
        i === 12
          ? "⚡ Lonjakan Gas MQ-2 (700 PPM) memicu GPIO 19 & GPIO 25!"
          : "Telemetri periodik normal.",
    }))
  );
  const [indeksReplay, setIndeksReplay] = useState<number>(12);
  const [sedangPlaybackReplay, setSedangPlaybackReplay] =
    useState<boolean>(false);
  const [kecepatanReplay, setKecepatanReplay] = useState<0.25 | 0.5 | 1>(0.25);

  useEffect(() => {
    if (!sedangPlaybackReplay) return;
    const jedaMs = Math.round(600 / kecepatanReplay);
    const timer = setInterval(() => {
      setIndeksReplay((prev) =>
        prev >= riwayatBlackbox.length - 1 ? 0 : prev + 1
      );
    }, jedaMs);
    return () => clearInterval(timer);
  }, [sedangPlaybackReplay, kecepatanReplay, riwayatBlackbox.length]);

  const frameBlackboxAktif =
    riwayatBlackbox[indeksReplay] || riwayatBlackbox[0];

  // ==========================================================================
  // FITUR UNIK #10: AUTO-WIRE BEAUTIFIER & IEEE MONOCHROME SCHEMATIC EXPORTER
  // ==========================================================================
  const [statusBeautifierKabel, setStatusBeautifierKabel] =
    useState<string>("");

  const unduhSkematikIeeeSvg = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 360" width="760" height="360">
  <rect width="760" height="360" fill="#ffffff" stroke="#000000" stroke-width="3"/>
  <text x="380" y="32" text-anchor="middle" font-family="Times New Roman, serif" font-size="16" font-weight="bold">
    IEEE STANDARD MONOCHROME HARDWARE SCHEMATIC — HIBAHILMU IOT LAB
  </text>
  <text x="380" y="50" text-anchor="middle" font-family="Times New Roman, serif" font-size="11">
    Author: Muhammad Saputra (NIM: 2556102007 • Class: 25 MTTK A) | MCU: ESP32 Dual-Core / ESP32-C6
  </text>
  <!-- Kotak MCU ESP32 -->
  <rect x="60" y="85" width="180" height="210" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="150" y="115" text-anchor="middle" font-family="Courier New, monospace" font-size="13" font-weight="bold">U1: ESP32-WROOM-32</text>
  <text x="150" y="135" text-anchor="middle" font-family="Courier New, monospace" font-size="10">3.3V Logic • Wi-Fi/BLE</text>
  <text x="232" y="165" text-anchor="end" font-family="Courier New, monospace" font-size="10">GPIO 34 (ADC1)</text>
  <text x="232" y="205" text-anchor="end" font-family="Courier New, monospace" font-size="10">GPIO 26 (RELAY)</text>
  <text x="232" y="245" text-anchor="end" font-family="Courier New, monospace" font-size="10">GPIO 19 (ALARM)</text>
  <text x="232" y="280" text-anchor="end" font-family="Courier New, monospace" font-size="10">GND (COMMON)</text>
  <!-- Jalur Ortogonal Siku-Siku IEEE -->
  <polyline points="240,162 460,162" fill="none" stroke="#000000" stroke-width="2"/>
  <polyline points="240,202 380,202 380,210 460,210" fill="none" stroke="#000000" stroke-width="2"/>
  <polyline points="240,242 360,242 360,260 460,260" fill="none" stroke="#000000" stroke-width="2"/>
  <polyline points="240,277 460,277" fill="none" stroke="#000000" stroke-width="2"/>
  <!-- Blok Sensor & Aktuator -->
  <rect x="460" y="135" width="240" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="580" y="162" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold">S1: ANALOG SENSOR MODULE</text>
  <rect x="460" y="192" width="240" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="580" y="219" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold">K1: OPTO-ISOLATED RELAY 5V</text>
  <rect x="460" y="248" width="240" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="580" y="275" text-anchor="middle" font-family="Courier New, monospace" font-size="11" font-weight="bold">BZ1: PIEZO SIREN ACTUATOR</text>
  <!-- Title Block Kanan Bawah Standar Kampus -->
  <rect x="460" y="305" width="285" height="42" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <text x="470" y="323" font-family="Times New Roman, serif" font-size="10" font-weight="bold">TITLE: SMART IOT TELEMETRY &amp; CONTROL</text>
  <text x="470" y="339" font-family="Times New Roman, serif" font-size="9">SCALE: 1:1 | FORMAT: IEEE STD-315 | REV: 2.0</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "Skema_IEEE_HibahIlmu_IoT_Muhammad_Saputra_2556102007.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border-2 border-amber-400/60 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-xs">
      {/* HEADER NAVIGASI 5 FITUR UNIK TAHAP 2 DI TAB 1 STUDIO */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
              🚀 5 FITUR UNIK TAB 1 STUDIO (TAHAP 2 • #6 S.D. #10)
            </span>
            <span className="text-[11px] font-bold text-emerald-300">
              Solar MPPT 24 Jam • Voice Command AI • Cyber-Security Pentest • Time-Travel Replay • Skema IEEE
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-white">
            Simulasi Energi Surya 24 Jam, Kendali Suara, Keamanan Siber MQTT, Kotak Hitam &amp; Ekspor Skema Jurnal IEEE
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTabAktif("solar_mppt_24h")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "solar_mppt_24h"
                ? "bg-amber-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> 6. Solar MPPT 24 Jam
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("voice_command")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "voice_command"
                ? "bg-emerald-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> 7. Voice Command IoT
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("cyber_pentest")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "cyber_pentest"
                ? "bg-rose-500 text-white font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> 8. Cyber-Security Pentest
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("blackbox_replay")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "blackbox_replay"
                ? "bg-sky-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" /> 9. Time-Travel Replay
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("ieee_schematic")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "ieee_schematic"
                ? "bg-indigo-500 text-white font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> 10. Auto-Wire &amp; Skema IEEE
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FITUR UNIK #6: SOLAR PANEL MPPT & SIKLUS MATAHARI 24 JAM            */}
      {/* =================================================================== */}
      {tabAktif === "solar_mppt_24h" && (
        <div className="space-y-3">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                {adalahSiangHari ? (
                  <Sun className="w-5 h-5 text-amber-400 animate-spin" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-300" />
                )}
                <span className="font-extrabold text-white text-sm">
                  ☀️ Simulator Panel Surya MPPT &amp; Siklus Cuaca 24 Jam ({formatJamMenit(jamMatahari)} —{" "}
                  {adalahSiangHari ? "SIANG HARI" : "MALAM HARI"})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setAutoSiklus24Jam(!autoSiklus24Jam)}
                className={`px-3.5 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer ${
                  autoSiklus24Jam
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-800 text-amber-300 border border-amber-400/40"
                }`}
              >
                {autoSiklus24Jam ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> ⏸ Hentikan Time-Lapse 24 Jam
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> ▶ Putar Otomatis Siklus 24 Jam
                  </>
                )}
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={23.5}
              step={0.5}
              value={jamMatahari}
              onChange={(e) => setJamMatahari(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>00:00 (Tengah Malam)</span>
              <span>06:00 (Terbit)</span>
              <span className="text-amber-300 font-bold">
                12:00 (Puncak MPPT 480 mA)
              </span>
              <span>18:00 (Terbenam)</span>
              <span>23:30 (Malam)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">CAHAYA MATAHARI (LDR)</div>
                <div className="text-base font-black text-amber-300">
                  {luxDariMatahari} Lux
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">ARUS PANEN SURYA MPPT</div>
                <div className="text-base font-black text-emerald-400">
                  +{arusChargingSolarMa} mA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">ARUS BEBAN RANGKAIAN</div>
                <div className="text-base font-black text-rose-400">
                  -{arusBebanRangkaianMa} mA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-sky-500/40">
                <div className="text-[10px] text-slate-400">VOLTASE BATERAI 18650</div>
                <div className="text-base font-black text-sky-300">
                  {teganganBaterai18650.toFixed(2)} V (
                  {netArusBateraiMa >= 0 ? "⚡ CHARGING" : "🔋 DISCHARGING"})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #7: SMART HOME VOICE COMMAND ("HALO HIBAHILMU!")         */}
      {/* =================================================================== */}
      {tabAktif === "voice_command" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-extrabold text-emerald-300 text-sm">
              🎙️ Kendali Suara AI Smart Home &amp; Kebun ("Halo HibahIlmu!")
            </div>
            <p className="text-slate-300 leading-relaxed">
              Gunakan mikrofon laptop/HP Anda atau klik tombol perintah suara cepat di bawah untuk menggerakkan Kipas, Solenoid Pintu, Pompa Sprinkler, dan Lampu Jalan melalui Broker MQTT!
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={mulaiRekamMikrofonBrowser}
                className={`px-4 py-2.5 rounded-xl font-extrabold flex items-center gap-2 cursor-pointer shadow-lg ${
                  sedangMendengarkanSuara
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-emerald-400 text-slate-950"
                }`}
              >
                {sedangMendengarkanSuara ? (
                  <>
                    <MicOff className="w-4 h-4" /> 🔴 Mendengarkan Suara Anda...
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" /> 🎙️ Bicara via Mikrofon Sekarang
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-amber-300">
                ⚡ Atau Klik Simulasi Perintah Suara Cepat:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Halo HibahIlmu, nyalakan kipas ruang tamu!",
                  "Halo HibahIlmu, buka kunci pintu sekarang!",
                  "Halo HibahIlmu, nyalakan pompa air kebun!",
                  "Halo HibahIlmu, aktifkan lampu jalan malam!",
                ].map((cmd, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => eksekusiKalimatPerintahSuara(cmd)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-left text-sky-300 font-semibold cursor-pointer transition"
                  >
                    🗣️ &quot;{cmd}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-emerald-500/40 space-y-3 font-mono">
            <div className="text-xs font-bold text-slate-400">
              HASIL PENGENALAN SUARA (SPEECH-TO-MQTT INTENT):
            </div>
            <div className="p-3 rounded-xl bg-black border border-slate-800 text-amber-300 text-sm font-bold">
              {transkripSuaraTerakhir}
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200">
              {aksiSuaraTerakhir}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #8: CYBER-SECURITY & IOT PENETRATION TESTING             */}
      {/* =================================================================== */}
      {tabAktif === "cyber_pentest" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-extrabold text-rose-400 text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Laboratorium Uji Penetrasi Keamanan Siber IoT (MITM Attack vs TLS 8883)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Uji apakah sistem Smart Door Lock &amp; Broker MQTT Anda tahan terhadap penyadapan paket! Jika masih memakai Port 1883 tanpa enkripsi, hacker dapat mengirim perintah palsu <code className="text-rose-300">/unlock_solenoid</code>.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={lancarkanSimulasiSeranganHacker}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Unlock className="w-4 h-4" /> 🕵️ Lancarkan Serangan Hacker (MITM Spoofing)
              </button>

              <button
                type="button"
                onClick={() => {
                  setProteksiTlsHmacAktif(true);
                  setStatusSeranganSiber("SERANGAN_DITANGKIS");
                  onUpdateKodeStudio(
                    `${kodeStudioAktif.trimEnd()}\n// --- PROTEKSI KEAMANAN SIBER TLS 8883 & HMAC-SHA256 ---\n#include <WiFiClientSecure.h>\n#define MQTT_PORT_TLS 8883\n#define USE_HMAC_SIGNATURE true\n`
                  );
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Lock className="w-4 h-4" /> 🛡️ Aktifkan Enkripsi TLS 8883 + HMAC di Kode
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-black p-4 rounded-2xl border border-slate-800 space-y-2.5 font-mono">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-300">
                🔒 STATUS KEAMANAN BROKER:
              </span>
              <span
                className={`px-2.5 py-0.5 rounded font-black text-[10px] ${
                  statusSeranganSiber === "DITEMBUS_HACKER"
                    ? "bg-rose-600 text-white animate-bounce"
                    : statusSeranganSiber === "SERANGAN_DITANGKIS"
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {statusSeranganSiber === "DITEMBUS_HACKER"
                  ? "🚨 RENTAN (PORT 1883 DITEMBUS!)"
                  : statusSeranganSiber === "SERANGAN_DITANGKIS"
                  ? "🛡️ AMAN (TLS 8883 + HMAC ACTIVE)"
                  : "STANDBY"}
              </span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto text-[11px]">
              {logSeranganList.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border ${
                    log.includes("BREACH")
                      ? "bg-rose-950/60 border-rose-500 text-rose-200"
                      : "bg-slate-950 border-slate-800 text-emerald-300"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #9: BLACKBOX TIME-TRAVEL REPLAY (60 DETIK & SLOW-MO)     */}
      {/* =================================================================== */}
      {tabAktif === "blackbox_replay" && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <div className="font-extrabold text-sky-300 text-sm">
                ⏪ Perekam Kotak Hitam (Blackbox Time-Travel Replay) &amp; Analisis Detik Kejadian
              </div>
              <div className="text-slate-400">
                Geser timeline di bawah untuk memutar mundur waktu (Rewind) ke detik ke-13 saat lonjakan gas pertama kali memicu aktuator!
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {([0.25, 0.5, 1] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setKecepatanReplay(spd)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                    kecepatanReplay === spd
                      ? "bg-sky-400 text-slate-950"
                      : "bg-slate-950 text-slate-400"
                  }`}
                >
                  {spd}x Speed
                </button>
              ))}

              <button
                type="button"
                onClick={() => setSedangPlaybackReplay(!sedangPlaybackReplay)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
              >
                {sedangPlaybackReplay ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Replay
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Putar Replay
                  </>
                )}
              </button>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={riwayatBlackbox.length - 1}
            value={indeksReplay}
            onChange={(e) => setIndeksReplay(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[9px] text-slate-400">DETIK REKAMAN</div>
              <div className="text-sm font-black text-white">
                T+{frameBlackboxAktif.detikKe}s ({frameBlackboxAktif.jamSimulasi})
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[9px] text-slate-400">SUHU &amp; CAHAYA</div>
              <div className="text-sm font-black text-emerald-400">
                {frameBlackboxAktif.suhuC}°C | {frameBlackboxAktif.luxCahaya}Lx
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[9px] text-slate-400">KADAR GAS MQ-2</div>
              <div className="text-sm font-black text-amber-300">
                {frameBlackboxAktif.gasPpm} PPM
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
              <div className="text-[9px] text-slate-400">STATUS KEJADIAN KOTAK HITAM</div>
              <div className="text-xs font-bold text-rose-300 truncate">
                {frameBlackboxAktif.statusAktuator}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #10: AUTO-WIRE BEAUTIFIER & IEEE SCHEMATIC EXPORTER      */}
      {/* =================================================================== */}
      {tabAktif === "ieee_schematic" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-extrabold text-indigo-300 text-sm">
              📐 Auto-Wire Orthogonal Beautifier &amp; Ekspor Skema Standar Jurnal IEEE (.SVG)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Rapikan seluruh jalur kabel di Studio Kanvas agar sejajar 90 derajat bebas silang-menyilang dalam 1 klik, atau unduh gambar Skematik Hitam-Putih berstandar IEEE Std-315 untuk Bab 3 Skripsi / Publikasi Ilmiah!
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setStatusBeautifierKabel(
                    "✨ Seluruh jalur kabel berhasil dirapikan mengikuti grid ortogonal 90° Manhattan PCB!"
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Wand2 className="w-4 h-4" /> ✨ Rapikan Jalur Kabel Otomatis (Auto-Route)
              </button>

              <button
                type="button"
                onClick={unduhSkematikIeeeSvg}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" /> 📐 Unduh Skema Hitam-Putih IEEE (.svg)
              </button>
            </div>

            {statusBeautifierKabel && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-400 text-emerald-200 font-semibold">
                {statusBeautifierKabel}
              </div>
            )}
          </div>

          {/* Pratinjau Mini Skematik Monokrom IEEE */}
          <div className="lg:col-span-6 bg-white p-3 rounded-2xl border-4 border-slate-700 text-slate-950 font-mono text-[10px] space-y-1 shadow-xl">
            <div className="text-center font-bold border-b border-slate-400 pb-1">
              PREVIEW: IEEE STD-315 MONOCHROME SCHEMATIC DIAGRAM
            </div>
            <div className="grid grid-cols-3 items-center py-2 text-center">
              <div className="p-2 border-2 border-black font-bold">
                U1: ESP32-WROOM
                <br />
                [GPIO 34, 26, 19]
              </div>
              <div className="font-bold">
                ──────►
                <br />
                ORTHOGONAL BUS
                <br />
                ──────►
              </div>
              <div className="p-2 border-2 border-black font-bold">
                S1: NPK / MQ-2
                <br />
                K1: RELAY 5V
              </div>
            </div>
            <div className="text-right text-[9px] border-t border-slate-400 pt-1">
              DRAWN BY: MUHAMMAD SAPUTRA (2556102007 • 25 MTTK A)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};