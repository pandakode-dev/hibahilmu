"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Building2,
  Calculator,
  CheckCircle2,
  CloudUpload,
  Cpu,
  DoorClosed,
  DoorOpen,
  Fan,
  FileSpreadsheet,
  Flame,
  Layers,
  Network,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Thermometer,
  Wind,
  Zap,
} from "lucide-react";

export interface ZonaRuanganFisika {
  id: string;
  nama: string;
  suhuC: number;
  gasPpm: number;
  kelembapanPersen: number;
  kipasAktif: boolean;
  sprinklerAktif: boolean;
  titikApiAktif: boolean;
}

export interface ItemBomRab {
  id: string;
  namaKomponen: string;
  kategori: string;
  qty: number;
  hargaSatuanRp: number;
  dayaWatt: number;
}

export interface PerangkatBusProtokol {
  id: string;
  nama: string;
  jenisBus: "I2C (SDA/SCL)" | "RS485 Modbus" | "SPI Bus";
  alamatHex: string;
  kecepatanBus: string;
}

const DAFTAR_AWAL_BOM_RAB: ItemBomRab[] = [
  {
    id: "bom-1",
    namaKomponen: "ESP32-C6 / ESP32 DevKit V1 Dual-Core Wi-Fi 6",
    kategori: "Mikrokontroler",
    qty: 2,
    hargaSatuanRp: 85000,
    dayaWatt: 0.85,
  },
  {
    id: "bom-2",
    namaKomponen: "Sensor Pupuk NPK Tanah RS485 Modbus Waterproof",
    kategori: "Sensor Presisi",
    qty: 1,
    hargaSatuanRp: 425000,
    dayaWatt: 0.45,
  },
  {
    id: "bom-3",
    namaKomponen: "Sensor Gas LPG MQ-2 + Sensor Suhu DHT22 + LDR",
    kategori: "Sensor Lingkungan",
    qty: 1,
    hargaSatuanRp: 68000,
    dayaWatt: 0.65,
  },
  {
    id: "bom-4",
    namaKomponen: "Modul Relay 4-Channel 5V Optocoupler + Pompa Air Mini",
    kategori: "Aktuator Daya",
    qty: 1,
    hargaSatuanRp: 75000,
    dayaWatt: 4.5,
  },
  {
    id: "bom-5",
    namaKomponen: "Layar OLED I2C 0.96 Inch + Baterai Li-Ion 18650 + Holder",
    kategori: "Display & Daya",
    qty: 1,
    hargaSatuanRp: 62000,
    dayaWatt: 0.3,
  },
];

export const HibahIlmuTab1Stage1UniqueSuite: React.FC<{
  kodeStudioAktif: string;
  onUpdateKodeStudio: (kodeBaru: string) => void;
}> = ({ kodeStudioAktif, onUpdateKodeStudio }) => {
  const [tabAktif, setTabAktif] = useState<
    | "cross_room_physics"
    | "bom_rab_pln"
    | "isometric_3d"
    | "ota_firmware"
    | "bus_sniffer"
  >("cross_room_physics");

  // ==========================================================================
  // 1. STATE SIMULASI FISIKA LINTAS-RUANGAN (CROSS-ROOM PROPAGATION)
  // ==========================================================================
  const [pintuSekatTertutup, setPintuSekatTertutup] = useState<boolean>(false);
  const [simulasiFisikaBerjalan, setSimulasiFisikaBerjalan] =
    useState<boolean>(true);
  const [daftarRuangan, setDaftarRuangan] = useState<ZonaRuanganFisika[]>([
    {
      id: "ruang_a",
      nama: "Ruang A: Server & Gateway",
      suhuC: 24.5,
      gasPpm: 180,
      kelembapanPersen: 55,
      kipasAktif: true,
      sprinklerAktif: false,
      titikApiAktif: false,
    },
    {
      id: "ruang_b",
      nama: "Ruang B: Smart Home / Tamu",
      suhuC: 29.0,
      gasPpm: 210,
      kelembapanPersen: 62,
      kipasAktif: false,
      sprinklerAktif: false,
      titikApiAktif: false,
    },
    {
      id: "ruang_c",
      nama: "Ruang C: Greenhouse Kebun",
      suhuC: 31.5,
      gasPpm: 195,
      kelembapanPersen: 74,
      kipasAktif: false,
      sprinklerAktif: true,
      titikApiAktif: false,
    },
    {
      id: "ruang_d",
      nama: "Ruang D: Boiler Pabrik PLC",
      suhuC: 38.0,
      gasPpm: 640,
      kelembapanPersen: 42,
      kipasAktif: false,
      sprinklerAktif: false,
      titikApiAktif: true,
    },
  ]);

  // Loop fisika termodinamika & perambatan asap antar-ruangan setiap 1.1 detik
  useEffect(() => {
    if (!simulasiFisikaBerjalan) return;
    const timer = setInterval(() => {
      setDaftarRuangan((prev) => {
        const next = prev.map((r) => ({ ...r }));
        for (let i = 0; i < next.length; i++) {
          const r = next[i];
          // Efek titik api memanaskan ruangan & menaikkan PPM asap
          if (r.titikApiAktif) {
            r.suhuC = Math.min(65, Number((r.suhuC + 1.4).toFixed(1)));
            r.gasPpm = Math.min(1200, Math.round(r.gasPpm + 45));
          }
          // Efek Kipas Exhaust menurunkan suhu & membuang asap
          if (r.kipasAktif) {
            r.suhuC = Math.max(22, Number((r.suhuC - 0.9).toFixed(1)));
            r.gasPpm = Math.max(150, Math.round(r.gasPpm - 35));
          }
          // Efek Sprinkler Pemadam menurunkan suhu drastis & mematikan api jika suhu < 32
          if (r.sprinklerAktif) {
            r.suhuC = Math.max(24, Number((r.suhuC - 2.2).toFixed(1)));
            r.gasPpm = Math.max(160, Math.round(r.gasPpm - 70));
            r.kelembapanPersen = Math.min(95, r.kelembapanPersen + 4);
            if (r.suhuC <= 30) r.titikApiAktif = false;
          }

          // DIFUSI / PERAMBATAN PANAS & ASAP ANTAR-RUANGAN TETANGGA
          // Jika pintu sekat TERBUKA, asap & panas dari Ruang D merambat cepat ke Ruang C -> B -> A!
          if (!pintuSekatTertutup && i > 0) {
            const tetangga = next[i - 1];
            const selisihSuhu = r.suhuC - tetangga.suhuC;
            const selisihGas = r.gasPpm - tetangga.gasPpm;

            if (Math.abs(selisihSuhu) > 1.5) {
              const transferSuhu = Number((selisihSuhu * 0.15).toFixed(1));
              tetangga.suhuC = Number((tetangga.suhuC + transferSuhu).toFixed(1));
              r.suhuC = Number((r.suhuC - transferSuhu * 0.5).toFixed(1));
            }
            if (Math.abs(selisihGas) > 30) {
              const transferGas = Math.round(selisihGas * 0.22);
              tetangga.gasPpm = Math.min(1200, tetangga.gasPpm + transferGas);
            }
          }
        }
        return next;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [simulasiFisikaBerjalan, pintuSekatTertutup]);

  // ==========================================================================
  // 2. STATE BILL OF MATERIALS (RAB RUPIAH) & TARIF LISTRIK PLN
  // ==========================================================================
  const [daftarBom, setDaftarBom] = useState<ItemBomRab[]>(DAFTAR_AWAL_BOM_RAB);
  const [jamOperasiPerHari, setJamOperasiPerHari] = useState<number>(24);
  const tarifPlnPerKwh = 1444.7; // Tarif dasar listrik R1/Bisnis Rp 1.444,70 / kWh

  const totalBiayaHardwareRp = daftarBom.reduce(
    (acc, item) => acc + item.qty * item.hargaSatuanRp,
    0
  );
  const totalDayaWatt = daftarBom.reduce(
    (acc, item) => acc + item.qty * item.dayaWatt,
    0
  );
  const kwhPerBulan = (totalDayaWatt * jamOperasiPerHari * 30) / 1000;
  const biayaPlnSebulanRp = Math.round(kwhPerBulan * tarifPlnPerKwh);

  // ==========================================================================
  // 3. STATE 3D ISOMETRIC SMART BUILDING & PCB VIEWER
  // ==========================================================================
  const [sudutRotasiX, setSudutRotasiX] = useState<number>(52);
  const [sudutRotasiZ, setSudutRotasiZ] = useState<number>(-28);
  const [tampilkanGelombangUdara3D, setTampilkanGelombangUdara3D] =
    useState<boolean>(true);

  // ==========================================================================
  // 4. STATE OVER-THE-AIR (OTA) FIRMWARE UPDATE & AUTO-ROLLBACK
  // ==========================================================================
  const [partisiAktif, setPartisiAktif] = useState<"ota_0 (v1.0 Stable)" | "ota_1 (v2.0 New)">(
    "ota_0 (v1.0 Stable)"
  );
  const [progresOtaPersen, setProgresOtaPersen] = useState<number>(0);
  const [statusOta, setStatusOta] = useState<
    "IDLE" | "UPLOADING" | "VERIFYING" | "SUCCESS_BOOT" | "ROLLBACK_CRASH"
  >("IDLE");
  const [simulasikanBugWatchdog, setSimulasikanBugWatchdog] =
    useState<boolean>(false);

  const mulaiProsesOtaUpdate = () => {
    setProgresOtaPersen(0);
    setStatusOta("UPLOADING");
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setProgresOtaPersen(Math.min(100, p));
      if (p >= 100) {
        clearInterval(interval);
        setStatusOta("VERIFYING");
        setTimeout(() => {
          const adaWhileSatuTanpaDelay =
            /while\s*\(\s*1\s*\)\s*\{\s*\}/.test(kodeStudioAktif) ||
            simulasikanBugWatchdog;
          if (adaWhileSatuTanpaDelay) {
            setStatusOta("ROLLBACK_CRASH");
            setPartisiAktif("ota_0 (v1.0 Stable)");
          } else {
            setStatusOta("SUCCESS_BOOT");
            setPartisiAktif("ota_1 (v2.0 New)");
          }
        }, 900);
      }
    }, 300);
  };

  // ==========================================================================
  // 5. STATE I2C / SPI / RS485 MODBUS PACKET SNIFFER & ADDRESS COLLISION
  // ==========================================================================
  const [perangkatBusList, setPerangkatBusList] = useState<
    PerangkatBusProtokol[]
  >([
    {
      id: "bus-1",
      nama: "Layar OLED 128x64 #1 (Ruang Server)",
      jenisBus: "I2C (SDA/SCL)",
      alamatHex: "0x3C",
      kecepatanBus: "400 kHz",
    },
    {
      id: "bus-2",
      nama: "Layar OLED 128x64 #2 (Smart Home)",
      jenisBus: "I2C (SDA/SCL)",
      alamatHex: "0x3D",
      kecepatanBus: "400 kHz",
    },
    {
      id: "bus-3",
      nama: "Sensor Pupuk NPK Tanah (Kebun)",
      jenisBus: "RS485 Modbus",
      alamatHex: "0x01",
      kecepatanBus: "9600 bps",
    },
    {
      id: "bus-4",
      nama: "Sensor Energi PZEM-004T (Pabrik)",
      jenisBus: "RS485 Modbus",
      alamatHex: "0x02",
      kecepatanBus: "9600 bps",
    },
  ]);

  // Cek apakah ada alamat kembar pada jenis bus yang sama!
  const daftarKonflikAlamat: string[] = [];
  for (let i = 0; i < perangkatBusList.length; i++) {
    for (let j = i + 1; j < perangkatBusList.length; j++) {
      if (
        perangkatBusList[i].jenisBus === perangkatBusList[j].jenisBus &&
        perangkatBusList[i].alamatHex === perangkatBusList[j].alamatHex
      ) {
        daftarKonflikAlamat.push(
          `BENTROK ALAMAT ${perangkatBusList[i].jenisBus} [${perangkatBusList[i].alamatHex}]: "${perangkatBusList[i].nama}" bertabrakan dengan "${perangkatBusList[j].nama}"!`
        );
      }
    }
  }

  return (
    <div className="bg-slate-950 border-2 border-teal-400/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-2xl text-xs">
      {/* HEADER NAVIGASI 5 FITUR UNIK TAHAP 1 DI TAB 1 STUDIO */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black text-[10px] uppercase">
              🌟 5 FITUR UNIK TAB 1 STUDIO (TAHAP 1)
            </span>
            <span className="text-[11px] font-bold text-amber-300">
              Fisika Lintas-Ruang • Kalkulator RAB &amp; PLN • Gedung 3D Isometrik • Wi-Fi OTA Rollback • I2C/Modbus Sniffer
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-white">
            Laboratorium Rekayasa Sistem IoT Gedung, Estimasi Biaya Proyek &amp; Diagnostik Protokol
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTabAktif("cross_room_physics")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "cross_room_physics"
                ? "bg-teal-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> 1. Fisika Lintas-Ruang
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("bom_rab_pln")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "bom_rab_pln"
                ? "bg-amber-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> 2. RAB Rupiah &amp; PLN
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("isometric_3d")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "isometric_3d"
                ? "bg-sky-400 text-slate-950 font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3. Gedung 3D Isometrik
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("ota_firmware")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "ota_firmware"
                ? "bg-purple-500 text-white font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" /> 4. Wi-Fi OTA &amp; Rollback
          </button>

          <button
            type="button"
            onClick={() => setTabAktif("bus_sniffer")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition ${
              tabAktif === "bus_sniffer"
                ? "bg-rose-500 text-white font-black shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5" /> 5. I2C / Modbus Sniffer
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FITUR UNIK #1: SIMULASI FISIKA LINTAS-RUANGAN (CROSS-ROOM PHYSICS)  */}
      {/* =================================================================== */}
      {tabAktif === "cross_room_physics" && (
        <div className="space-y-3">
          <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <div className="space-y-0.5">
              <div className="font-extrabold text-teal-300">
                🌡️ Perambatan Suhu Panas &amp; Asap Lintas-Ruangan (Thermodynamic &amp; Gas Diffusion Engine):
              </div>
              <div className="text-slate-400 text-[11px]">
                Jika ada titik api di Ruang D (Pabrik) dan Pintu Sekat Servo terbuka, asap PPM &amp; hawa panas akan merambat menembus Ruang C, B, hingga Ruang A Server!
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPintuSekatTertutup(!pintuSekatTertutup)}
                className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer border ${
                  pintuSekatTertutup
                    ? "bg-emerald-500 text-slate-950 border-white shadow-lg"
                    : "bg-rose-600 text-white border-rose-300 animate-pulse"
                }`}
              >
                {pintuSekatTertutup ? (
                  <>
                    <DoorClosed className="w-4 h-4" /> 🔒 Pintu Sekat Servo: TERTUTUP (Isolasi Aman)
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-4 h-4" /> 🔓 Pintu Sekat Servo: TERBUKA (Asap Merambat!)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setDaftarRuangan((prev) =>
                    prev.map((r) => ({
                      ...r,
                      kipasAktif: true,
                      sprinklerAktif: true,
                    }))
                  )
                }
                className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black cursor-pointer"
              >
                💦 Nyalakan Semua Kipas &amp; Sprinkler
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daftarRuangan.map((r, idx) => {
              const bahaya = r.suhuC >= 36 || r.gasPpm >= 500;
              return (
                <div
                  key={r.id}
                  className={`p-3.5 rounded-2xl border-2 space-y-2.5 transition ${
                    bahaya
                      ? "bg-rose-950/40 border-rose-500 shadow-lg"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-white">{r.nama}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        bahaya
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {bahaya ? "🚨 BAHAYA" : "✅ AMAN"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 font-mono text-center">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-400">SUHU</div>
                      <div
                        className={`text-sm font-black ${
                          r.suhuC >= 36 ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {r.suhuC}°C
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-400">ASAP/GAS</div>
                      <div
                        className={`text-sm font-black ${
                          r.gasPpm >= 500 ? "text-amber-300" : "text-sky-400"
                        }`}
                      >
                        {r.gasPpm}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-[9px] text-slate-400">LEMBAB</div>
                      <div className="text-sm font-black text-teal-300">
                        {r.kelembapanPersen}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setDaftarRuangan((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, titikApiAktif: !item.titikApiAktif }
                              : item
                          )
                        )
                      }
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] cursor-pointer ${
                        r.titikApiAktif
                          ? "bg-rose-600 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      🔥 {r.titikApiAktif ? "Api: MENYALA" : "Picu Api"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDaftarRuangan((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, kipasAktif: !item.kipasAktif }
                              : item
                          )
                        )
                      }
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] cursor-pointer ${
                        r.kipasAktif
                          ? "bg-sky-500 text-slate-950"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      🌀 {r.kipasAktif ? "Kipas: ON" : "Kipas: OFF"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDaftarRuangan((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  sprinklerAktif: !item.sprinklerAktif,
                                }
                              : item
                          )
                        )
                      }
                      className={`w-full py-1.5 px-2 rounded-lg font-bold text-[10px] cursor-pointer ${
                        r.sprinklerAktif
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      🚿 {r.sprinklerAktif ? "Sprinkler Pompa: ON" : "Sprinkler Pompa: OFF"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #2: BILL OF MATERIALS (RAB RUPIAH) & TARIF LISTRIK PLN   */}
      {/* =================================================================== */}
      {tabAktif === "bom_rab_pln" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-8 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-300">
                  💰 Tabel Rencana Anggaran Biaya (RAB) Perangkat Keras Proyek IoT:
                </span>
                <span className="text-[11px] text-slate-400">
                  Ubah jumlah (Qty) sesuai komponen proyek Anda
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 pr-2">Nama Komponen</th>
                      <th className="py-2 px-2">Qty</th>
                      <th className="py-2 px-2">Harga Satuan</th>
                      <th className="py-2 px-2">Daya</th>
                      <th className="py-2 pl-2 text-right">Subtotal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarBom.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800/60 text-slate-200"
                      >
                        <td className="py-2 pr-2 font-sans font-semibold">
                          {item.namaKomponen}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={item.qty}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value));
                              setDaftarBom((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, qty: val } : x
                                )
                              );
                            }}
                            className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-amber-300 text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          Rp {item.hargaSatuanRp.toLocaleString("id-ID")}
                        </td>
                        <td className="py-2 px-2 text-sky-300">
                          {(item.qty * item.dayaWatt).toFixed(2)} W
                        </td>
                        <td className="py-2 pl-2 text-right font-bold text-emerald-400">
                          Rp{" "}
                          {(item.qty * item.hargaSatuanRp).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ringkasan Total RAB & Estimasi Tagihan Listrik PLN */}
            <div className="lg:col-span-4 bg-slate-900 p-4 rounded-2xl border border-amber-400/50 space-y-3">
              <div className="font-extrabold text-white text-sm">
                📊 Ringkasan Biaya Alat &amp; Listrik PLN Bulanan
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">
                  TOTAL BIAYA KOMPONEN (RAB HARDWARE):
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  Rp {totalBiayaHardwareRp.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">Jam Nyala per Hari:</span>
                  <span className="font-bold text-amber-300">
                    {jamOperasiPerHari} Jam/Hari
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={jamOperasiPerHari}
                  onChange={(e) => setJamOperasiPerHari(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="text-[11px] font-mono text-sky-300">
                  • Beban Total: <strong>{totalDayaWatt.toFixed(2)} Watt</strong> ({kwhPerBulan.toFixed(2)} kWh/bln)
                </div>
                <div className="text-[11px] font-mono text-amber-300">
                  • Estimasi Tagihan PLN:{" "}
                  <strong>Rp {biayaPlnSebulanRp.toLocaleString("id-ID")} / bulan</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #3: MODE 3D ISOMETRIC SMART BUILDING & PCB VIEWER        */}
      {/* =================================================================== */}
      {tabAktif === "isometric_3d" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-5 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-extrabold text-sky-300 text-sm">
              🧊 Visualisasi 3D Isometric Smart Building &amp; Elevasi Jaringan IoT
            </div>
            <p className="text-slate-300 leading-relaxed">
              Putar sudut kamera 3D di bawah untuk mengamati tata letak 4 ruangan gedung secara spasial, lengkap dengan pancaran gelombang udara menuju menara Cloud Broker!
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sudut Kemiringan (Tilt X):</span>
                <span className="font-mono text-amber-300">{sudutRotasiX}°</span>
              </div>
              <input
                type="range"
                min={20}
                max={70}
                value={sudutRotasiX}
                onChange={(e) => setSudutRotasiX(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />

              <div className="flex justify-between">
                <span>Sudut Putar Horizontal (Rotate Z):</span>
                <span className="font-mono text-emerald-300">{sudutRotasiZ}°</span>
              </div>
              <input
                type="range"
                min={-60}
                max={60}
                value={sudutRotasiZ}
                onChange={(e) => setSudutRotasiZ(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSudutRotasiX(52);
                setSudutRotasiZ(-28);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
            >
              Reset Kamera Isometrik Default
            </button>
          </div>

          {/* Kanvas 3D Isometric CSS Transform */}
          <div className="lg:col-span-7 bg-[#050811] rounded-2xl border border-sky-500/40 h-64 flex items-center justify-center overflow-hidden relative">
            <div
              style={{
                transform: `perspective(900px) rotateX(${sudutRotasiX}deg) rotateZ(${sudutRotasiZ}deg)`,
                transformStyle: "preserve-3d",
              }}
              className="w-80 h-52 grid grid-cols-2 gap-3 p-3 bg-slate-900/90 border-4 border-sky-400 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-transform duration-200"
            >
              {daftarRuangan.map((r) => (
                <div
                  key={r.id}
                  className={`p-2.5 rounded-xl border-2 flex flex-col justify-between ${
                    r.suhuC >= 36
                      ? "bg-rose-950/80 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.8)]"
                      : "bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  }`}
                >
                  <div className="text-[9px] font-black text-white truncate">
                    {r.nama}
                  </div>
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="text-amber-300">{r.suhuC}°C</span>
                    <span className="text-sky-300">{r.gasPpm}ppm</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400 text-sky-300 font-mono text-[10px]">
              ☁️ 3D Telemetry Uplink: ACTIVE
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #4: WI-FI OTA FIRMWARE UPDATE & DUAL-PARTITION ROLLBACK  */}
      {/* =================================================================== */}
      {tabAktif === "ota_firmware" && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <div className="font-extrabold text-purple-300 text-sm">
                ☁️ Simulator Over-The-Air (OTA) Firmware Update &amp; Watchdog Auto-Rollback
              </div>
              <div className="text-slate-400">
                Uji pengiriman firmware baru lewat Wi-Fi tanpa kabel USB! Jika firmware baru mengandung bug <code className="text-rose-300">while(1){"{}"}</code> (Watchdog Timeout), bootloader otomatis memulihkan partisi lama (<code className="text-emerald-300">ota_0</code>)!
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSimulasikanBugWatchdog(!simulasikanBugWatchdog)}
                className={`px-3 py-2 rounded-xl font-bold cursor-pointer border ${
                  simulasikanBugWatchdog
                    ? "bg-rose-600 text-white border-white"
                    : "bg-slate-950 text-slate-300 border-slate-700"
                }`}
              >
                {simulasikanBugWatchdog
                  ? "🐞 Mode Simulasi Bug Watchdog: ON"
                  : "🐞 Uji Suntik Bug Crash di OTA"}
              </button>

              <button
                type="button"
                onClick={mulaiProsesOtaUpdate}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <CloudUpload className="w-4 h-4" /> Upload Firmware via Wi-Fi OTA Sekarang
              </button>
            </div>
          </div>

          {/* Progress Bar Flashing OTA */}
          <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              style={{ width: `${progresOtaPersen}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">PARTISI BOOT AKTIF:</div>
              <div className="text-emerald-400 font-black text-sm">
                {partisiAktif}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">PROGRES TRANSFER OTA:</div>
              <div className="text-amber-300 font-black text-sm">
                {progresOtaPersen}% (Port 3232 UDP)
              </div>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                statusOta === "ROLLBACK_CRASH"
                  ? "bg-rose-950/60 border-rose-500 text-rose-200"
                  : "bg-slate-950 border-slate-800 text-sky-300"
              }`}
            >
              <div className="text-[10px]">STATUS BOOTLOADER ESP32:</div>
              <div className="font-black">
                {statusOta === "ROLLBACK_CRASH"
                  ? "⚠️ WDT TIMEOUT! AUTO-ROLLBACK KE ota_0!"
                  : statusOta === "SUCCESS_BOOT"
                  ? "✅ OTA SUKSES! RUNNING ota_1 (v2.0)"
                  : statusOta}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FITUR UNIK #5: I2C / SPI / RS485 MODBUS PACKET SNIFFER              */}
      {/* =================================================================== */}
      {tabAktif === "bus_sniffer" && (
        <div className="space-y-3">
          {daftarKonflikAlamat.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-950 border-2 border-rose-500 text-rose-100 font-mono space-y-1 animate-bounce">
              <div className="font-black text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> ⚠️ DETEKSI TABRAKAN ALAMAT BUS HARDWARE (ADDRESS COLLISION)!
              </div>
              {daftarKonflikAlamat.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="font-extrabold text-rose-300">
                🔌 Tabel Alamat Perangkat Bus (Ubah Alamat Hex untuk Menguji Konflik I2C / Modbus):
              </div>
              <div className="space-y-2">
                {perangkatBusList.map((dev, idx) => (
                  <div
                    key={dev.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap justify-between items-center gap-2"
                  >
                    <div>
                      <div className="font-bold text-white">{dev.nama}</div>
                      <div className="text-[10px] text-sky-400 font-mono">
                        {dev.jenisBus} • Speed: {dev.kecepatanBus}
                      </div>
                    </div>

                    <select
                      value={dev.alamatHex}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPerangkatBusList((prev) =>
                          prev.map((x, i) =>
                            i === idx ? { ...x, alamatHex: val } : x
                          )
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/50 text-amber-300 font-mono text-xs"
                    >
                      {dev.jenisBus.includes("I2C") ? (
                        <>
                          <option value="0x3C">Alamat I2C: 0x3C</option>
                          <option value="0x3D">Alamat I2C: 0x3D</option>
                          <option value="0x27">Alamat I2C: 0x27 (LCD)</option>
                          <option value="0x76">Alamat I2C: 0x76 (BME280)</option>
                        </>
                      ) : (
                        <>
                          <option value="0x01">Slave ID Modbus: 0x01</option>
                          <option value="0x02">Slave ID Modbus: 0x02</option>
                          <option value="0x03">Slave ID Modbus: 0x03</option>
                        </>
                      )}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-black p-4 rounded-2xl border border-slate-800 font-mono space-y-2">
              <div className="text-emerald-400 font-bold">
                📟 LIVE HEX FRAME PROTOCOL SNIFFER:
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                {perangkatBusList.map((d) => (
                  <div
                    key={d.id}
                    className="p-2 rounded bg-slate-950 border border-slate-800"
                  >
                    <div className="text-amber-300 font-bold">
                      [{d.jenisBus}] Target: {d.alamatHex}
                    </div>
                    <div className="text-emerald-300">
                      START ➔ {d.alamatHex} (WRITE) ➔{" "}
                      {daftarKonflikAlamat.length > 0 ? "NACK (COLLISION!)" : "ACK ✓"}{" "}
                      ➔ 0x00 0xFA ➔ CRC16 ➔ STOP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};