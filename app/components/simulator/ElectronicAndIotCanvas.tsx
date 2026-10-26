"use client";

import React, { useState } from "react";
import {
  Cpu,
  Wifi,
  Thermometer,
  Activity,
  Zap,
  ToggleLeft,
  ToggleRight,
  Radio,
  Gauge,
} from "lucide-react";

interface CanvasProps {
  mode: "wokwi" | "ewb";
}

export const ElectronicAndIotCanvas: React.FC<CanvasProps> = ({ mode }) => {
  // ============================================================================
  // 1. STATE PAPAN VIRTUAL WOKWI (ESP32 + LED + DHT22 + ULTRASONIK + SERVO)
  // ============================================================================
  const [ledPin2, setLedPin2] = useState(true);
  const [ledPin4, setLedPin4] = useState(false);
  const [ledPin5, setLedPin5] = useState(true);
  const [suhuDht, setSuhuDht] = useState(28.5);
  const [kelembapanDht, setKelembapanDht] = useState(65);
  const [jarakUltrasonik, setJarakUltrasonik] = useState(42);
  const [sudutServo, setSudutServo] = useState(90);

  // ============================================================================
  // 2. STATE MEJA KERJA EWB (HUKUM OHM, OSILOSKOP & GERBANG LOGIKA DIGITAL)
  // ============================================================================
  const [teganganVcc, setTeganganVcc] = useState(12);
  const [resistorR1, setResistorR1] = useState(1000);
  const [resistorR2, setResistorR2] = useState(2000);
  const [bentukGelombang, setBentukGelombang] = useState<"sinus" | "kotak" | "segitiga">("sinus");
  const [frekuensiHz, setFrekuensiHz] = useState(50);

  // Gerbang Logika Digital (EWB Digital Workbench)
  const [jenisGerbang, setJenisGerbang] = useState<"AND" | "OR" | "NAND" | "XOR">("AND");
  const [inputLogikaA, setInputLogikaA] = useState<boolean>(true);
  const [inputLogikaB, setInputLogikaB] = useState<boolean>(false);

  if (mode === "wokwi") {
    const alarmSuhuTinggi = suhuDht >= 35 || ledPin4;

    return (
      <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-emerald-500/40 space-y-6 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="font-black text-sm uppercase tracking-wider text-emerald-300">
              Wokwi Virtual Breadboard — ESP32 DevKit V1 &amp; IoT Sensors
            </span>
          </div>
          <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" /> WiFi Connected: 192.168.1.108
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Visual Board ESP32 & Pin LED */}
          <div className="md:col-span-5 bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>BOARD: ESP32-WROOM-32D</span>
              <span className="text-emerald-400">3.3V / 5V GND</span>
            </div>

            {/* Indikator 3 Lampu LED GPIO */}
            <div className="grid grid-cols-3 gap-3 text-center pt-1">
              <button
                type="button"
                onClick={() => setLedPin2(!ledPin2)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-full transition-all ${
                    ledPin2
                      ? "bg-emerald-400 shadow-[0_0_20px_#34d399]"
                      : "bg-slate-800"
                  }`}
                />
                <span className="text-[10px] font-mono font-bold">
                  GPIO 2 (Hijau): {ledPin2 ? "HIGH" : "LOW"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLedPin4(!ledPin4)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-full transition-all ${
                    alarmSuhuTinggi
                      ? "bg-rose-500 shadow-[0_0_20px_#f43f5e] animate-pulse"
                      : "bg-slate-800"
                  }`}
                />
                <span className="text-[10px] font-mono font-bold">
                  GPIO 4 (Alarm): {alarmSuhuTinggi ? "HIGH" : "LOW"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLedPin5(!ledPin5)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-full transition-all ${
                    ledPin5
                      ? "bg-sky-400 shadow-[0_0_20px_#38bdf8]"
                      : "bg-slate-800"
                  }`}
                />
                <span className="text-[10px] font-mono font-bold">
                  GPIO 5 (Biru): {ledPin5 ? "HIGH" : "LOW"}
                </span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <div>• Klik lampu LED di atas untuk toggle HIGH/LOW manual.</div>
              <div>
                • Status Alarm Suhu (&gt;=35°C):{" "}
                <b className={alarmSuhuTinggi ? "text-rose-400" : "text-emerald-400"}>
                  {alarmSuhuTinggi ? "AKTIF (OVERHEAT!)" : "NORMAL"}
                </b>
              </div>
            </div>
          </div>

          {/* Kontrol Sensor Virtual Wokwi (DHT22, HC-SR04, Servo) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center font-black text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4" /> Sensor Suhu DHT22 (GPIO 15)
                </span>
                <span>{suhuDht}°C</span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={0.5}
                value={suhuDht}
                onChange={(e) => setSuhuDht(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between items-center font-bold text-sky-300 pt-1">
                <span>Kelembapan Udara (Humidity):</span>
                <span>{kelembapanDht}% RH</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={kelembapanDht}
                onChange={(e) => setKelembapanDht(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center font-black text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4" /> Ultrasonik HC-SR04 (Trig 12)
                </span>
                <span>{jarakUltrasonik} cm</span>
              </div>
              <input
                type="range"
                min={2}
                max={400}
                value={jarakUltrasonik}
                onChange={(e) => setJarakUltrasonik(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />

              <div className="flex justify-between items-center font-bold text-indigo-300 pt-1">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" /> Motor Servo SG90 (PWM 18):
                </span>
                <span>{sudutServo}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                value={sudutServo}
                onChange={(e) => setSudutServo(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // TAMPILAN MEJA KERJA EWB (ELECTRONICS WORKBENCH & GERBANG LOGIKA)
  // ============================================================================
  const hambatanTotal = resistorR1 + resistorR2;
  const arusMa = (teganganVcc / (hambatanTotal || 1)) * 1000;
  const teganganVout = teganganVcc * (resistorR2 / (hambatanTotal || 1));
  const dayaMw = teganganVcc * arusMa;

  const hitungOutputLogika = () => {
    if (jenisGerbang === "AND") return inputLogikaA && inputLogikaB;
    if (jenisGerbang === "OR") return inputLogikaA || inputLogikaB;
    if (jenisGerbang === "NAND") return !(inputLogikaA && inputLogikaB);
    return inputLogikaA !== inputLogikaB; // XOR
  };

  const outputLogika = hitungOutputLogika();

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-purple-500/40 space-y-6 shadow-xl">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-black text-sm uppercase tracking-wider text-purple-300">
            EWB (Electronics Workbench) — Multimeter, Osiloskop &amp; Digital Logic Lab
          </span>
        </div>
        <span className="text-xs font-mono bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">
          SPICE Interactive Circuit Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Simulator Hukum Ohm, Pembagi Tegangan & Multimeter Digital */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <div className="font-black text-amber-300 uppercase">
            ⚡ Rangkaian Pembagi Tegangan &amp; Multimeter
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between font-bold">
                <span>Tegangan Sumber (Vcc):</span>
                <span className="text-amber-300">{teganganVcc} Volt</span>
              </div>
              <input
                type="range"
                min={3}
                max={24}
                value={teganganVcc}
                onChange={(e) => setTeganganVcc(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold">
                <span>Resistor R1 (Seri Atas):</span>
                <span className="text-emerald-300">{resistorR1} Ω</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={resistorR1}
                onChange={(e) => setResistorR1(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold">
                <span>Resistor R2 (Beban Bawah):</span>
                <span className="text-sky-300">{resistorR2} Ω</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={resistorR2}
                onChange={(e) => setResistorR2(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Layar Multimeter Digital */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Vout (R2)</div>
              <div className="text-sm font-black text-emerald-400">
                {teganganVout.toFixed(2)} V
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Arus (I)</div>
              <div className="text-sm font-black text-amber-300">
                {arusMa.toFixed(2)} mA
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Daya (P)</div>
              <div className="text-sm font-black text-sky-300">
                {dayaMw.toFixed(1)} mW
              </div>
            </div>
          </div>
        </div>

        {/* 2. Layar Osiloskop 2-Channel & 3. Gerbang Logika Digital */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Layar Osiloskop */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-black text-emerald-400 flex items-center gap-1">
                <Activity className="w-4 h-4" /> Osiloskop ({frekuensiHz} Hz)
              </span>
              <div className="flex gap-1">
                {(["sinus", "kotak", "segitiga"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setBentukGelombang(g)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer ${
                      bentukGelombang === g
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualisasi SVG Gelombang Osiloskop */}
            <div className="h-28 rounded-xl bg-[#041f14] border border-emerald-500/30 flex items-center justify-center p-2 relative overflow-hidden">
              <svg viewBox="0 0 200 60" className="w-full h-full stroke-emerald-400 fill-none">
                {bentukGelombang === "sinus" && (
                  <path
                    d="M 0 30 Q 25 0, 50 30 T 100 30 T 150 30 T 200 30"
                    strokeWidth="2.5"
                  />
                )}
                {bentukGelombang === "kotak" && (
                  <path
                    d="M 0 45 L 0 15 L 50 15 L 50 45 L 100 45 L 100 15 L 150 15 L 150 45 L 200 45"
                    strokeWidth="2.5"
                  />
                )}
                {bentukGelombang === "segitiga" && (
                  <path
                    d="M 0 45 L 25 10 L 75 50 L 125 10 L 175 50 L 200 30"
                    strokeWidth="2.5"
                  />
                )}
              </svg>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
              <span>Vp-p: {(teganganVout * 2).toFixed(1)}V</span>
              <input
                type="range"
                min={10}
                max={200}
                value={frekuensiHz}
                onChange={(e) => setFrekuensiHz(Number(e.target.value))}
                className="w-24 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Simulator Gerbang Logika Digital (AND / OR / NAND / XOR) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-black text-purple-300 uppercase">
                🔢 Gerbang Logika IC 74LS
              </span>
              <div className="flex gap-1">
                {(["AND", "OR", "NAND", "XOR"] as const).map((gt) => (
                  <button
                    key={gt}
                    type="button"
                    onClick={() => setJenisGerbang(gt)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer ${
                      jenisGerbang === gt
                        ? "bg-purple-500 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {gt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInputLogikaA(!inputLogikaA)}
                className={`p-2.5 rounded-xl border font-mono font-black flex items-center justify-between cursor-pointer ${
                  inputLogikaA
                    ? "bg-indigo-600/30 border-indigo-400 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <span>IN A: {inputLogikaA ? "1" : "0"}</span>
                {inputLogikaA ? (
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setInputLogikaB(!inputLogikaB)}
                className={`p-2.5 rounded-xl border font-mono font-black flex items-center justify-between cursor-pointer ${
                  inputLogikaB
                    ? "bg-indigo-600/30 border-indigo-400 text-white"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <span>IN B: {inputLogikaB ? "1" : "0"}</span>
                {inputLogikaB ? (
                  <ToggleRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
              </button>
            </div>

            <div
              className={`p-3 rounded-xl border text-center font-mono font-black ${
                outputLogika
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              OUTPUT ({jenisGerbang}): {outputLogika ? "HIGH (1) 💡 NYALA" : "LOW (0) ⚫ MATI"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};