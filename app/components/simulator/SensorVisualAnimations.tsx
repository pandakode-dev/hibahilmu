"use client";

import React from "react";

export interface SensorSimulationState {
  jarakUltrasonikCm: number; // 2 - 400 cm (mengatur posisi orang berjalan mendekat/menjauh)
  pirMotionDetected: boolean; // true = orang bergerak di zona infra merah
  suhuDhtCelcius: number; // -10 - 60 C
  kelembapanTanahPersen: number; // 0 - 100 %
  intensitasCahayaLux: number; // 0 - 1000 Lux
  kadarGasPpm: number; // 100 - 1000 PPM
  rfidCardTapped: boolean; // true = Kartu ditempel ke reader
  sudutServoDerajat: number; // 0 - 180 derajat
  relaySolenoidUnlock: boolean; // true = Pintu terbuka
  relayPompaAirOn: boolean; // true = Pompa menyemprotkan air
  kipasPendinginOn: boolean; // true = Baling-baling berputar
  lampuJalanOn: boolean; // true = Lampu menyala terang
}

interface Props {
  state: SensorSimulationState;
  onChangeState: (partial: Partial<SensorSimulationState>) => void;
}

export function SensorVisualAnimations({ state, onChangeState }: Props) {
  // Posisi horizontal karakter orang berjalan (semakin kecil jarak cm, semakin dekat ke sensor di kiri)
  const posisiOrangPersen = Math.min(88, Math.max(18, (state.jarakUltrasonikCm / 400) * 85));

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* 1. KANVAS ANIMASI ORANG BERJALAN: SENSOR ULTRASONIK HC-SR04 & PIR     */}
      {/* ===================================================================== */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-2xl text-white space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
              Live Physics &amp; Human Motion Canvas
            </span>
            <h3 className="text-lg font-black mt-1">
              Animasi Objek Manusia Berjalan — Sensor Ultrasonik HC-SR04 &amp; PIR Motion
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onChangeState({
                  pirMotionDetected: !state.pirMotionDetected,
                })
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                state.pirMotionDetected
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {state.pirMotionDetected ? "PIR: GERAKAN TERDETEKSI!" : "PIR: Tidak Ada Gerakan"}
            </button>
          </div>
        </div>

        {/* Visualisasi Radar Gelombang & Orang Berjalan */}
        <div className="relative w-full h-56 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/40 rounded-2xl border border-slate-800 overflow-hidden">
          {/* Grid Latar Belakang */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="iotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#38bdf8" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#iotGrid)" />
          </svg>

          {/* Zona Kerucut Inframerah PIR */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 220">
            <polygon
              points="70,110 580,20 580,200"
              fill={state.pirMotionDetected ? "rgba(244, 63, 94, 0.16)" : "rgba(16, 185, 129, 0.08)"}
              stroke={state.pirMotionDetected ? "#f43f5e" : "#10b981"}
              strokeDasharray="6 4"
              strokeWidth="1.5"
            />
            {/* Gelombang Ultrasonik memancar dari Sensor ke posisi Orang */}
            {[1, 2, 3].map((waveIdx) => {
              const waveX = 75 + ((posisiOrangPersen * 4.5 - 75) * waveIdx) / 3.5;
              return (
                <path
                  key={waveIdx}
                  d={`M ${waveX} ${80 - waveIdx * 10} Q ${waveX + 18} 110 ${waveX} ${140 + waveIdx * 10}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
              );
            })}

            {/* Garis Ukur Jarak */}
            <line
              x1="75"
              y1="185"
              x2={posisiOrangPersen * 5.6}
              y2="185"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text
              x={Math.max(95, (posisiOrangPersen * 5.6) / 2)}
              y="178"
              fill="#fbbf24"
              fontSize="12"
              fontWeight="bold"
            >
              Jarak: {state.jarakUltrasonikCm} cm
            </text>
          </svg>

          {/* Modul Sensor HC-SR04 & PIR di Sebelah Kiri */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-16 h-28 bg-indigo-950 border-2 border-sky-400 rounded-2xl flex flex-col items-center justify-around p-1.5 shadow-lg">
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-[8px] font-black text-sky-300">
              TX
            </div>
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-black transition ${
                state.pirMotionDetected
                  ? "bg-rose-500 border-white text-white animate-ping"
                  : "bg-emerald-900 border-emerald-400 text-emerald-200"
              }`}
            >
              PIR
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center text-[8px] font-black text-sky-300">
              RX
            </div>
          </div>

          {/* KARAKTER ORANG BERJALAN (SVG ANIMATED) */}
          <div
            style={{ left: `${posisiOrangPersen}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200 flex flex-col items-center"
          >
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-black mb-1 whitespace-nowrap ${
                state.jarakUltrasonikCm < 80 || state.pirMotionDetected
                  ? "bg-rose-600 text-white animate-bounce"
                  : "bg-sky-500 text-slate-950"
              }`}
            >
              {state.pirMotionDetected ? "Gerakan Aktif!" : `${state.jarakUltrasonikCm} cm`}
            </div>

            {/* SVG Siluet Manusia dengan Animasi Kaki & Tangan Berjalan */}
            <svg width="54" height="86" viewBox="0 0 60 100" className="drop-shadow-lg">
              {/* Kepala */}
              <circle
                cx="30"
                cy="16"
                r="10"
                fill={state.pirMotionDetected ? "#fb7185" : "#38bdf8"}
              />
              {/* Badan */}
              <line
                x1="30"
                y1="26"
                x2="30"
                y2="60"
                stroke={state.pirMotionDetected ? "#fb7185" : "#38bdf8"}
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Tangan Mengayun */}
              <line
                x1="30"
                y1="34"
                x2={state.jarakUltrasonikCm % 2 === 0 ? "14" : "46"}
                y2="52"
                stroke="#e2e8f0"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <line
                x1="30"
                y1="34"
                x2={state.jarakUltrasonikCm % 2 === 0 ? "46" : "14"}
                y2="52"
                stroke="#94a3b8"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Kaki Melangkah Berjalan */}
              <line
                x1="30"
                y1="60"
                x2={state.jarakUltrasonikCm % 2 === 0 ? "16" : "44"}
                y2="92"
                stroke={state.pirMotionDetected ? "#fda4af" : "#7dd3fc"}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <line
                x1="30"
                y1="60"
                x2={state.jarakUltrasonikCm % 2 === 0 ? "44" : "16"}
                y2="92"
                stroke={state.pirMotionDetected ? "#f43f5e" : "#0284c7"}
                strokeWidth="5.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Slider Penggerak Orang Berjalan */}
        <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs font-black">
            <span className="text-sky-400">
              Geser untuk Menggerakkan Orang Mendekat / Menjauh dari Sensor:
            </span>
            <span className="text-amber-400">{state.jarakUltrasonikCm} cm</span>
          </div>
          <input
            type="range"
            min={5}
            max={400}
            value={state.jarakUltrasonikCm}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChangeState({
                jarakUltrasonikCm: val,
                pirMotionDetected: val < 150 ? true : state.pirMotionDetected,
              });
            }}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. GRID ANIMASI 6 SENSOR & AKTUATOR LAINNYA                           */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* A. SENSOR SUHU DHT22 & KIPAS PENDINGIN BERPUTAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-amber-400">DHT22 &amp; Kipas PWM</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300">
              {state.suhuDhtCelcius} °C
            </span>
          </div>

          <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around p-3">
            {/* Termometer Merkuri Animasi */}
            <div className="flex flex-col items-center">
              <div className="w-5 h-20 bg-slate-800 rounded-full p-1 flex items-end border border-slate-700">
                <div
                  style={{
                    height: `${Math.min(100, Math.max(10, ((state.suhuDhtCelcius + 10) / 70) * 100))}%`,
                  }}
                  className={`w-full rounded-full transition-all ${
                    state.suhuDhtCelcius >= 33 ? "bg-rose-500" : "bg-amber-400"
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Termometer</span>
            </div>

            {/* Baling-Baling Kipas Berputar */}
            <div className="flex flex-col items-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 100 100"
                className={
                  state.kipasPendinginOn || state.suhuDhtCelcius >= 32
                    ? "animate-spin"
                    : "opacity-40"
                }
                style={{ animationDuration: state.suhuDhtCelcius >= 38 ? "0.4s" : "1.1s" }}
              >
                <circle cx="50" cy="50" r="44" fill="none" stroke="#334155" strokeWidth="4" />
                <path d="M50 50 C35 20, 65 20, 50 10 C40 25, 45 40, 50 50" fill="#38bdf8" />
                <path d="M50 50 C80 35, 80 65, 90 50 C75 40, 60 45, 50 50" fill="#38bdf8" />
                <path d="M50 50 C65 80, 35 80, 50 90 C60 75, 55 60, 50 50" fill="#38bdf8" />
                <path d="M50 50 C20 65, 20 35, 10 50 C25 60, 40 55, 50 50" fill="#38bdf8" />
                <circle cx="50" cy="50" r="8" fill="#e2e8f0" />
              </svg>
              <span className="text-[10px] font-bold text-sky-400 mt-1">
                {state.kipasPendinginOn || state.suhuDhtCelcius >= 32
                  ? "Kipas Berputar"
                  : "Kipas Mati"}
              </span>
            </div>
          </div>

          <input
            type="range"
            min={-5}
            max={55}
            value={state.suhuDhtCelcius}
            onChange={(e) => {
              const s = Number(e.target.value);
              onChangeState({
                suhuDhtCelcius: s,
                kipasPendinginOn: s >= 32,
              });
            }}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* B. SENSOR KELEMBAPAN TANah & ANIMASI TETESAN POMPA AIR */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-sky-400">Soil Moisture &amp; Pompa Air</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300">
              {state.kelembapanTanahPersen}%
            </span>
          </div>

          <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-end p-3">
            {/* Tetesan Air Hujan/Pompa saat Tanah Kering atau Pompa ON */}
            {(state.relayPompaAirOn || state.kelembapanTanahPersen < 40) && (
              <div className="absolute inset-x-0 top-2 flex justify-around">
                {[1, 2, 3, 4, 5].map((d) => (
                  <span
                    key={d}
                    className="w-2 h-3.5 rounded-full bg-sky-400 animate-bounce"
                    style={{ animationDelay: `${d * 120}ms` }}
                  />
                ))}
              </div>
            )}

            <div className="text-center text-[11px] font-black text-sky-300 z-10 mb-1">
              {state.relayPompaAirOn || state.kelembapanTanahPersen < 40
                ? "POMPA AIR MENYIRAM TANAMAN..."
                : "Kelembapan Tanah Cukup"}
            </div>

            {/* Lapisan Air di Dalam Tanah */}
            <div
              style={{ height: `${Math.max(18, state.kelembapanTanahPersen * 0.65)}%` }}
              className="w-full rounded-xl bg-gradient-to-t from-sky-600 to-emerald-500/60 transition-all duration-300"
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={state.kelembapanTanahPersen}
            onChange={(e) => {
              const hum = Number(e.target.value);
              onChangeState({
                kelembapanTanahPersen: hum,
                relayPompaAirOn: hum < 40,
              });
            }}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        {/* C. SENSOR CAHAYA LDR & ANIMASI MATAHARI / LAMPU JALAN OTOMATIS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-yellow-400">Sensor Cahaya LDR &amp; Lampu</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-300">
              {state.intensitasCahayaLux} Lux
            </span>
          </div>

          <div
            className={`h-32 rounded-2xl border border-slate-800 flex items-center justify-around p-3 transition-colors duration-500 ${
              state.intensitasCahayaLux > 400
                ? "bg-gradient-to-b from-sky-900/60 to-amber-950/40"
                : "bg-slate-950"
            }`}
          >
            {/* Matahari Bersinar */}
            <div className="flex flex-col items-center">
              <div
                style={{ opacity: Math.max(0.2, state.intensitasCahayaLux / 1000) }}
                className="w-12 h-12 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 animate-pulse"
              />
              <span className="text-[10px] font-bold text-amber-200 mt-1">Cahaya Surya</span>
            </div>

            {/* Lampu Jalan Pintar (Menyala saat Gelap < 300 Lux) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-xs transition-all ${
                  state.intensitasCahayaLux < 300 || state.lampuJalanOn
                    ? "bg-yellow-300 text-slate-950 border-white shadow-xl shadow-yellow-300/60 scale-110"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                LED
              </div>
              <span className="text-[10px] font-bold text-slate-300 mt-1">
                {state.intensitasCahayaLux < 300 ? "Lampu ON (Malam)" : "Lampu OFF (Siang)"}
              </span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={1000}
            value={state.intensitasCahayaLux}
            onChange={(e) => {
              const lux = Number(e.target.value);
              onChangeState({
                intensitasCahayaLux: lux,
                lampuJalanOn: lux < 300,
              });
            }}
            className="w-full accent-yellow-400 cursor-pointer"
          />
        </div>

        {/* D. SENSOR GAS & ASAP MQ-2 DENGAN PARTIKEL ASAP NAIK */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-rose-400">Sensor Gas &amp; Asap MQ-2</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300">
              {state.kadarGasPpm} PPM
            </span>
          </div>

          <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-3">
            {/* Partikel Asap mengepul jika PPM > 400 */}
            {state.kadarGasPpm > 400 && (
              <div className="flex gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-500/50 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-rose-500/40 animate-bounce" />
                <div className="w-6 h-6 rounded-full bg-slate-400/50 animate-ping" />
              </div>
            )}
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                state.kadarGasPpm > 450
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-700"
              }`}
            >
              {state.kadarGasPpm > 450
                ? "ALARM BAHAYA GAS / ASAP AKTIF!"
                : "Udara Ruangan Aman & Bersih"}
            </div>
          </div>

          <input
            type="range"
            min={100}
            max={1000}
            value={state.kadarGasPpm}
            onChange={(e) => onChangeState({ kadarGasPpm: Number(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        {/* E. RFID RC522 SMART DOOR LOCK & SOLENOID ANIMATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-emerald-400">RFID RC522 &amp; Solenoid Lock</span>
            <span className="text-[11px] font-black text-slate-400">13.56 MHz</span>
          </div>

          <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around p-3">
            {/* Animasi Kartu RFID mendekat ke Reader */}
            <div
              onClick={() =>
                onChangeState({
                  rfidCardTapped: !state.rfidCardTapped,
                  relaySolenoidUnlock: !state.rfidCardTapped,
                })
              }
              className={`cursor-pointer p-3 rounded-xl border-2 transition-all duration-300 ${
                state.rfidCardTapped
                  ? "translate-x-3 bg-emerald-600 border-white text-slate-950 shadow-lg shadow-emerald-500/40"
                  : "bg-slate-800 border-slate-600 text-slate-200"
              }`}
            >
              <div className="text-[10px] font-black">KARTU E-KTP / RFID</div>
              <div className="text-[9px] font-mono mt-0.5">UID: A4 9F 21 C0</div>
            </div>

            {/* Palang Solenoid Door Lock */}
            <div className="flex flex-col items-center">
              <div
                className={`px-3 py-2 rounded-xl font-black text-xs border-2 transition-all ${
                  state.relaySolenoidUnlock
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-rose-500/20 border-rose-500 text-rose-300"
                }`}
              >
                {state.relaySolenoidUnlock ? "PINTU TERBUKA" : "TERKUNCI"}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Klik kartu untuk Tap</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onChangeState({
                rfidCardTapped: !state.rfidCardTapped,
                relaySolenoidUnlock: !state.relaySolenoidUnlock,
              })
            }
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
          >
            {state.rfidCardTapped ? "Lepaskan Kartu RFID" : "Tempelkan (Tap) Kartu RFID"}
          </button>
        </div>

        {/* F. MOTOR SERVO SG90 DENGAN LENGAN ROTASI DERAJAT */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-indigo-400">Aktuator Motor Servo SG90</span>
            <span className="text-sm font-black px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              {state.sudutServoDerajat}°
            </span>
          </div>

          <div className="h-32 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-3">
            <svg width="140" height="90" viewBox="0 0 140 90">
              {/* Busur Derajat 0 - 180 */}
              <path
                d="M 20 75 A 50 50 0 0 1 120 75"
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                strokeDasharray="4 4"
              />
              {/* Lengan Servo Berputar Sesuai Sudut */}
              <g transform={`translate(70, 75) rotate(${state.sudutServoDerajat - 90})`}>
                <rect x="-5" y="-52" width="10" height="52" rx="5" fill="#6366f1" />
                <circle cx="0" cy="-44" r="3" fill="#ffffff" />
              </g>
              <circle cx="70" cy="75" r="10" fill="#e2e8f0" />
            </svg>
          </div>

          <input
            type="range"
            min={0}
            max={180}
            value={state.sudutServoDerajat}
            onChange={(e) => onChangeState({ sudutServoDerajat: Number(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}