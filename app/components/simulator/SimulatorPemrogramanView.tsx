"use client";

import React, { useState, useEffect } from "react";
import { Play, RefreshCw, Cpu, Terminal, Activity, Wifi } from "lucide-react";
import { AkunPengguna } from "../../types";
import {
  SensorVisualAnimations,
  SensorSimulationState,
} from "./SensorVisualAnimations";

interface Props {
  userLogin: AkunPengguna | null;
  tambahXP: (xp: number) => void;
}

const PRESET_KODE: Record<string, { label: string; kode: string }> = {
  iot_esp32: {
    label: "IoT ESP32 & Blynk C++",
    kode: `// Firmware ESP32 Smart Radar Ultrasonik, PIR & DHT22
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT); // Relay Solenoid & Alarm
}

void loop() {
  Serial.println("Membaca sensor Ultrasonik, PIR, DHT22, LDR, dan Gas MQ-2...");
}`,
  },
  python: {
    label: "Python 3 (Data & AI)",
    kode: `# Kalkulasi Energi Kinetik & Analisis Sensor Python
massa = 12.5
kecepatan = 8.0
energi_kinetik = 0.5 * massa * (kecepatan ** 2)
print(f"Energi Kinetik Objek = {energi_kinetik} Joule")`,
  },
  cpp: {
    label: "C++ Algoritma & Struktur Data",
    kode: `#include <iostream>
using namespace std;

int main() {
    int jarakCm = 65;
    cout << "Status Radar Ultrasonik: " << jarakCm << " cm (Objek Terdeteksi)" << endl;
    return 0;
}`,
  },
  matlab: {
    label: "MATLAB / GNU Octave (Matriks & Sinyal)",
    kode: `% Simulasi Matriks & Respon Sinyal Sensor di MATLAB
A = [4 2; 1 3];
det_A = det(A);
 eig_A = eig(A);
disp("Determinan Matriks A = 10");
disp("Frekuensi Sampling Radar = 100 Hz");`,
  },
};

export function SimulatorPemrogramanView({ userLogin, tambahXP }: Props) {
  const [modeBahasa, setModeBahasa] = useState<string>("iot_esp32");
  const [kodeEditor, setKodeEditor] = useState<string>(PRESET_KODE.iot_esp32.kode);
  const [outputTerminal, setOutputTerminal] = useState<string>(
    "Terminal Siap. Gerakkan slider sensor di atas atau klik 'Jalankan Simulasi & Kode'."
  );
  const [sinkronCloudAktif, setSinkronCloudAktif] = useState<boolean>(true);

  const [sensorState, setSensorState] = useState<SensorSimulationState>({
    jarakUltrasonikCm: 95,
    pirMotionDetected: true,
    suhuDhtCelcius: 31,
    kelembapanTanahPersen: 35,
    intensitasCahayaLux: 240,
    kadarGasPpm: 280,
    rfidCardTapped: false,
    sudutServoDerajat: 90,
    relaySolenoidUnlock: true,
    relayPompaAirOn: true,
    kipasPendinginOn: false,
    lampuJalanOn: true,
  });

  const updateSensorState = (partial: Partial<SensorSimulationState>) => {
    setSensorState((prev) => {
      const next = { ...prev, ...partial };
      // Kirim otomatis ke /api/iot/cloud jika sinkronisasi aktif
      if (sinkronCloudAktif) {
        fetch("/api/iot/cloud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: userLogin ? `hbh_${userLogin.id}_proj5` : "hbh_public_demo",
            pemilikNama: userLogin?.nama || "Simulator Web",
            namaProject: "Full Sensor Animated Lab",
            sumber: "WEB_SIMULATOR",
            pin: "V0",
            value: next.suhuDhtCelcius,
          }),
        }).catch(() => {});
      }
      return next;
    });
  };

  const jalankanKodeSimulasi = () => {
    tambahXP(20);
    if (modeBahasa === "iot_esp32") {
      setOutputTerminal(
        `[ESP32 SERIAL MONITOR - 115200 baud]\n` +
          `> Ultrasonik HC-SR04 : ${sensorState.jarakUltrasonikCm} cm\n` +
          `> Sensor PIR Motion  : ${sensorState.pirMotionDetected ? "HIGH (Ada Orang Berjalan)" : "LOW (Kosong)"}\n` +
          `> Suhu DHT22         : ${sensorState.suhuDhtCelcius} C | Kipas: ${sensorState.kipasPendinginOn ? "ON" : "OFF"}\n` +
          `> Kelembapan Tanah   : ${sensorState.kelembapanTanahPersen}% | Pompa: ${sensorState.relayPompaAirOn ? "MENYIRAM" : "STANDBY"}\n` +
          `> Cahaya LDR         : ${sensorState.intensitasCahayaLux} Lux | Lampu Jalan: ${sensorState.lampuJalanOn ? "ON" : "OFF"}\n` +
          `> Sensor Gas MQ-2    : ${sensorState.kadarGasPpm} PPM | Servo SG90: ${sensorState.sudutServoDerajat} derajat`
      );
    } else if (modeBahasa === "python") {
      setOutputTerminal(
        `[PYTHON 3.12 INTERPRETER]\n` +
          `Energi Kinetik Objek = 400.0 Joule\n` +
          `Data Telemetri Sensor: Jarak=${sensorState.jarakUltrasonikCm}cm, Suhu=${sensorState.suhuDhtCelcius}C\n` +
          `Eksekusi selesai tanpa error (+20 XP).`
      );
    } else if (modeBahasa === "cpp") {
      setOutputTerminal(
        `[G++ C++20 COMPILER]\n` +
          `Compiling main.cpp ... OK\n` +
          `Status Radar Ultrasonik: ${sensorState.jarakUltrasonikCm} cm (Objek Terdeteksi)\n` +
          `Process exited with return code 0 (+20 XP).`
      );
    } else {
      setOutputTerminal(
        `[MATLAB / OCTAVE NUMERICAL ENGINE]\n` +
          `A =\n     4     2\n     1     3\n` +
          `Determinan Matriks A = 10\n` +
          `Eigenvalues = [5.0000, 2.0000]\n` +
          ` Plot Sinyal Ultrasonik (${sensorState.jarakUltrasonikCm} cm) berhasil dihitung (+20 XP).`
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SIMULATOR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
            <Cpu className="w-4 h-4" /> Laboratorium Virtual Terpadu (Web &amp; Android Sync)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Simulator IoT Animasi Sensor, Python, C++ &amp; MATLAB
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Dilengkapi animasi interaktif orang berjalan pada sensor PIR &amp; Ultrasonik,
            termometer DHT22, tetesan pompa kelembapan tanah, LDR cahaya, asap MQ-2, RFID, dan
            eksekutor multi-bahasa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSinkronCloudAktif(!sinkronCloudAktif)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition ${
            sinkronCloudAktif
              ? "bg-emerald-500 text-slate-950 shadow-lg"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>{sinkronCloudAktif ? "Blynk Cloud Sync: ON" : "Blynk Cloud Sync: OFF"}</span>
        </button>
      </div>

      {/* KANVAS ANIMASI VISUAL SELURUH SENSOR IOT */}
      <SensorVisualAnimations state={sensorState} onChangeState={updateSensorState} />

      {/* PILIHAN BAHASA PEMROGRAMAN & EDITOR KODE */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESET_KODE).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setModeBahasa(key);
                  setKodeEditor(item.kode);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  modeBahasa === key
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={jalankanKodeSimulasi}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Jalankan Simulasi &amp; Kode (+20 XP)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-black text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" /> Source Code Editor (
              {PRESET_KODE[modeBahasa]?.label})
            </div>
            <textarea
              value={kodeEditor}
              onChange={(e) => setKodeEditor(e.target.value)}
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-black text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" /> Output Terminal &amp; Serial Monitor
            </div>
            <pre className="w-full h-[228px] overflow-y-auto bg-black border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-300 whitespace-pre-wrap">
              {outputTerminal}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}