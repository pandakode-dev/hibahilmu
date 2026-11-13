"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  BatteryCharging,
  Flame,
  Gauge,
  LineChart,
  Radio,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  HasilAnalisisKerusakanFisik,
  HasilUkurMultimeter,
  ProfilKonsumsiDayaBaterai,
} from "./wokwiLabInstrumentsEngine";
import { ParameterFisikaInteraktif } from "./wokwiHardwareVisuals";

export interface TitikDataPlotter {
  waktuDetik: number;
  suhu: number;
  gasPpm: number;
  cahayaLux: number;
  pwmDuty: number;
}

const DAFTAR_PILIHAN_PROBE_PIN = [
  { id: "ESP_GPIO2", label: "GPIO 2 (LED / Output)" },
  { id: "ESP_GPIO4", label: "GPIO 4 (Input / GPS / Relay)" },
  { id: "ESP_GPIO13", label: "GPIO 13 (Servo PWM / RFID)" },
  { id: "ESP_GPIO15", label: "GPIO 15 (DHT22 / LED Hijau)" },
  { id: "ESP_GPIO19", label: "GPIO 19 (Buzzer Sirine)" },
  { id: "ESP_GPIO25", label: "GPIO 25 (Pompa Air)" },
  { id: "ESP_GPIO26", label: "GPIO 26 (Relay Lampu)" },
  { id: "ESP_GPIO32", label: "GPIO 32 (ADC Gas MQ-2)" },
  { id: "ESP_GPIO34", label: "GPIO 34 (ADC LDR / Potensio)" },
  { id: "ESP_GPIO35", label: "GPIO 35 (ADC Tegangan Baterai)" },
  { id: "ESP_3V3", label: "Pin 3V3 (Sumber Daya 3.3V)" },
];

export const WokwiInstrumentsAndPlotterPanel: React.FC<{
  kerusakanFisik: HasilAnalisisKerusakanFisik;
  multimeter: HasilUkurMultimeter;
  pinProbeMerah: string;
  setPinProbeMerah: (pin: string) => void;
  profilBaterai: ProfilKonsumsiDayaBaterai;
  fisika: ParameterFisikaInteraktif;
  simulasiAktif: boolean;
  onSisipkanDeepSleep: () => void;
  onPerbaikiKorsleting: () => void;
}> = ({
  kerusakanFisik,
  multimeter,
  pinProbeMerah,
  setPinProbeMerah,
  profilBaterai,
  fisika,
  simulasiAktif,
  onSisipkanDeepSleep,
  onPerbaikiKorsleting,
}) => {
  const [tabInstrumen, setTabInstrumen] = useState<
    "multimeter_osiloskop" | "serial_plotter" | "power_profiler"
  >("multimeter_osiloskop");

  const [riwayatPlotter, setRiwayatPlotter] = useState<TitikDataPlotter[]>([
    { waktuDetik: 1, suhu: 28, gasPpm: 210, cahayaLux: 600, pwmDuty: 120 },
    { waktuDetik: 2, suhu: 30, gasPpm: 240, cahayaLux: 550, pwmDuty: 150 },
    { waktuDetik: 3, suhu: 32, gasPpm: 300, cahayaLux: 450, pwmDuty: 180 },
  ]);

  // Rekam data grafik Serial Plotter secara real-time saat simulasi berjalan atau slider fisika digeser
  useEffect(() => {
    const timer = setInterval(() => {
      setRiwayatPlotter((prev) => {
        const lastTime = prev[prev.length - 1]?.waktuDetik || 0;
        const titikBaru: TitikDataPlotter = {
          waktuDetik: lastTime + 1,
          suhu: fisika.suhuCelcius,
          gasPpm: Math.round(fisika.kadarGasPpm / 10), // Skala 0-100 agar seimbang di grafik
          cahayaLux: Math.round(fisika.luxCahaya / 10), // Skala 0-100
          pwmDuty: Math.round((fisika.pwmLedBrightness / 255) * 100),
        };
        return [...prev.slice(-19), titikBaru];
      });
    }, 900);
    return () => clearInterval(timer);
  }, [
    fisika.suhuCelcius,
    fisika.kadarGasPpm,
    fisika.luxCahaya,
    fisika.pwmLedBrightness,
  ]);

  // Buat koordinat gelombang kotak (Square Wave) untuk Osiloskop PWM
  const dutyRatio = Math.max(0.05, Math.min(0.95, multimeter.dutyCyclePersen / 100));
  const lebarSiklus = 80;
  const lebarHigh = Math.round(lebarSiklus * dutyRatio);
  const pathOsiloskop =
    multimeter.dutyCyclePersen === 0
      ? "M 10 75 L 330 75"
      : multimeter.dutyCyclePersen >= 100
      ? "M 10 22 L 330 22"
      : [0, 1, 2, 3]
          .map((i) => {
            const x0 = 10 + i * lebarSiklus;
            const xHighEnd = x0 + lebarHigh;
            const xCycleEnd = x0 + lebarSiklus;
            return `${i === 0 ? "M" : "L"} ${x0} 75 L ${x0} 22 L ${xHighEnd} 22 L ${xHighEnd} 75 L ${xCycleEnd} 75`;
          })
          .join(" ");

  // Konversi titik data ke polyline SVG untuk Serial Plotter
  const buatPolylinePlotter = (
    ambilNilai: (d: TitikDataPlotter) => number,
    maxSkala: number
  ) => {
    if (riwayatPlotter.length === 0) return "";
    return riwayatPlotter
      .map((d, idx) => {
        const x = 35 + (idx / Math.max(1, riwayatPlotter.length - 1)) * 485;
        const val = Math.max(0, Math.min(maxSkala, ambilNilai(d)));
        const y = 115 - (val / maxSkala) * 95;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div className="space-y-3">
      {/* =================================================================== */}
      {/* BANNER PERINGATAN KERUSAKAN FISIK / KORSLETING / KOMPONEN GOSONG!   */}
      {/* =================================================================== */}
      {(kerusakanFisik.terjadiKorsletingDaya ||
        kerusakanFisik.ledPutusTanpaResistor) && (
        <div className="p-4 rounded-2xl bg-rose-950 border-2 border-rose-500 text-white shadow-2xl flex flex-wrap justify-between items-center gap-3 animate-bounce">
          <div className="flex items-start gap-3">
            <Flame className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> PERINGATAN KERUSAKAN HARDWARE FISIK (BURNOUT DETECTED)!
              </div>
              <p className="text-rose-100 leading-relaxed font-medium">
                {kerusakanFisik.pesanBahayaFisik}
              </p>
              <div className="text-[11px] font-mono text-amber-300">
                ⚡ Arus Lonjakan: <strong>{kerusakanFisik.arusPuncakMa} mA</strong> | Slot Terdampak:{" "}
                <strong>
                  {kerusakanFisik.slotKomponenGosong
                    .map((n) => `Slot #${n}`)
                    .join(", ")}
                </strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onPerbaikiKorsleting}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer shrink-0 shadow-lg"
          >
            🛠️ Ganti Komponen Baru &amp; Perbaiki Jalur
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* PANEL LABORATORIUM VIRTUAL: MULTIMETER, OSILOSKOP, PLOTTER & DAYA   */}
      {/* =================================================================== */}
      <div className="bg-slate-950 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm text-white">
              🔬 Instrumen Laboratorium Virtual (Multimeter, Osiloskop PWM, Serial Plotter &amp; Daya Baterai)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setTabInstrumen("multimeter_osiloskop")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
                tabInstrumen === "multimeter_osiloskop"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> 1. Multimeter &amp; Osiloskop PWM
            </button>

            <button
              type="button"
              onClick={() => setTabInstrumen("serial_plotter")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
                tabInstrumen === "serial_plotter"
                  ? "bg-emerald-400 text-slate-950 shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <LineChart className="w-3.5 h-3.5" /> 2. Live Serial Plotter (Grafik)
            </button>

            <button
              type="button"
              onClick={() => setTabInstrumen("power_profiler")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition ${
                tabInstrumen === "power_profiler"
                  ? "bg-sky-400 text-slate-950 shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" /> 3. Kalkulator Baterai 18650
            </button>
          </div>
        </div>

        {/* TAB 1: MULTIMETER DIGITAL & OSILOSKOP GELOMBANG PWM */}
        {tabInstrumen === "multimeter_osiloskop" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Multimeter Digital */}
            <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  🔴 Probe Merah (+) Ditempel ke Pin:
                </span>
                <select
                  value={pinProbeMerah}
                  onChange={(e) => setPinProbeMerah(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-400/60 text-white font-mono text-xs focus:outline-none"
                >
                  {DAFTAR_PILIHAN_PROBE_PIN.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="p-3 rounded-xl bg-black border border-emerald-500/40">
                  <div className="text-[10px] text-slate-400">TEGANGAN (DC)</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400">
                    {multimeter.teganganTerukurVolt.toFixed(2)} V
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black border border-sky-500/40">
                  <div className="text-[10px] text-slate-400">ARUS LISTRIK</div>
                  <div className="text-lg sm:text-xl font-black text-sky-400">
                    {multimeter.arusTerukurMa.toFixed(1)} mA
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black border border-amber-500/40">
                  <div className="text-[10px] text-slate-400">RESISTANSI</div>
                  <div className="text-lg sm:text-xl font-black text-amber-300">
                    {multimeter.hambatanTerukurOhm} Ω
                  </div>
                </div>
              </div>
            </div>

            {/* Layar Osiloskop Gelombang Kotak PWM */}
            <div className="lg:col-span-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400 font-bold">
                  📈 OSCILLOSCOPE — SINYAL PWM &amp; LOGIKA DIGITAL:
                </span>
                <span className="text-amber-300">
                  Duty: {multimeter.dutyCyclePersen}% | {multimeter.frekuensiPwmHz} Hz
                </span>
              </div>

              <svg
                viewBox="0 0 340 95"
                className="w-full h-24 bg-[#040d0a] rounded-xl border border-emerald-500/40"
              >
                {/* Garis Grid Osiloskop */}
                {[22, 48, 75].map((y) => (
                  <line
                    key={y}
                    x1={0}
                    y1={y}
                    x2={340}
                    y2={y}
                    stroke="#064e3b"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                ))}
                <text x={6} y={18} fill="#34d399" fontSize="7.5" fontFamily="monospace">
                  3.3V (HIGH)
                </text>
                <text x={6} y={88} fill="#64748b" fontSize="7.5" fontFamily="monospace">
                  0.0V (LOW)
                </text>

                <path
                  d={pathOsiloskop}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2.8}
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE SERIAL PLOTTER (GRAFIK MULTI-VARIABEL REAL-TIME) */}
        {tabInstrumen === "serial_plotter" && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
              <span className="font-bold text-white">
                📈 Arduino / MicroPython Serial Plotter (Grafik Sensor Real-Time):
              </span>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                <span className="text-rose-400 font-bold">
                  ● Suhu: {fisika.suhuCelcius}°C
                </span>
                <span className="text-sky-400 font-bold">
                  ● Gas/10: {Math.round(fisika.kadarGasPpm / 10)}
                </span>
                <span className="text-amber-300 font-bold">
                  ● Cahaya/10: {Math.round(fisika.luxCahaya / 10)}
                </span>
                <span className="text-emerald-400 font-bold">
                  ● PWM: {Math.round((fisika.pwmLedBrightness / 255) * 100)}%
                </span>
              </div>
            </div>

            <svg
              viewBox="0 0 540 130"
              className="w-full h-36 bg-[#060913] rounded-xl border border-slate-800"
            >
              {[20, 50, 80, 115].map((y, idx) => (
                <g key={y}>
                  <line
                    x1={35}
                    y1={y}
                    x2={525}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth={1}
                  />
                  <text
                    x={28}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {100 - idx * 33}
                  </text>
                </g>
              ))}

              {/* Garis Suhu (Merah Muda) */}
              <polyline
                fill="none"
                stroke="#fb7185"
                strokeWidth={2.5}
                points={buatPolylinePlotter((d) => d.suhu, 100)}
              />
              {/* Garis Gas PPM (Biru Langit) */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth={2.5}
                points={buatPolylinePlotter((d) => d.gasPpm, 100)}
              />
              {/* Garis Cahaya Lux (Kuning) */}
              <polyline
                fill="none"
                stroke="#facc15"
                strokeWidth={2.2}
                points={buatPolylinePlotter((d) => d.cahayaLux, 100)}
              />
              {/* Garis PWM Duty (Hijau) */}
              <polyline
                fill="none"
                stroke="#34d399"
                strokeWidth={2.2}
                points={buatPolylinePlotter((d) => d.pwmDuty, 100)}
              />
            </svg>
          </div>
        )}

        {/* TAB 3: KALKULATOR MASA PAKAI BATERAI 18650 & DEEP SLEEP PROFILER */}
        {tabInstrumen === "power_profiler" && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <div className="font-extrabold text-sky-300 text-sm">
                  🔋 Analisis Konsumsi Arus &amp; Estimasi Umur Baterai Li-Ion 18650 (2500 mAh)
                </div>
                <div className="text-slate-400">
                  Bandingkan daya tahan baterai antara mode aktif terus-menerus vs mode hemat energi <code className="text-emerald-300">esp_deep_sleep_start()</code>!
                </div>
              </div>

              {!profilBaterai.modeDeepSleepAktif && (
                <button
                  type="button"
                  onClick={onSisipkanDeepSleep}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" /> + Sisipkan Kode Deep Sleep (Hemat 99% Baterai!)
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">ARUS CPU + WI-FI</div>
                <div className="text-base font-black text-white">
                  {(profilBaterai.arusMcuMa + profilBaterai.arusWifiMa).toFixed(1)} mA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">ARUS SENSOR/BEBAN</div>
                <div className="text-base font-black text-sky-400">
                  {profilBaterai.arusPeriferalMa.toFixed(1)} mA
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40">
                <div className="text-[10px] text-slate-400">TOTAL KONSUMSI</div>
                <div className="text-base font-black text-amber-300">
                  {profilBaterai.totalArusMa} mA
                </div>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  profilBaterai.modeDeepSleepAktif
                    ? "bg-emerald-950/50 border-emerald-400 text-emerald-300"
                    : "bg-rose-950/40 border-rose-500/50 text-rose-300"
                }`}
              >
                <div className="text-[10px]">ESTIMASI UMUR BATERAI</div>
                <div className="text-base font-black">
                  {profilBaterai.estimasiTahanHari >= 1
                    ? `${profilBaterai.estimasiTahanHari} Hari (${profilBaterai.estimasiTahanJam} Jam)`
                    : `${profilBaterai.estimasiTahanJam} Jam`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};