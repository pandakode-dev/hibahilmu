"use client";

import React, { useRef } from "react";
import { Sliders, Trash2, Cable } from "lucide-react";
import {
  PIN_FISIK_ESP32_STANDAR,
  MiniaturSvgGudang48,
  TitikPinFisik,
  ParameterFisikaInteraktif,
} from "./wokwiHardwareVisuals";
import {
  DefinisiSlotPeriferalMultiPin,
  AturanSambunganKabelReal,
  hitungGelangResistorModular,
} from "./wokwiAcademyBlueprints";

export interface KabelMultiPinTersambung {
  pinAsalId: string;
  pinTujuanId: string;
  warna: string;
}

const PILIHAN_OHM_RESISTOR = [100, 220, 330, 470, 1000, 4700, 10000];

// Geser posisi pin ESP32 sedikit lebih lega di kanvas lebar 920px agar tidak menabrak chip WROOM
const PIN_ESP32_KANVAS_LEBAR: TitikPinFisik[] = PIN_FISIK_ESP32_STANDAR.map(
  (p) => ({
    ...p,
    x: p.x < 100 ? 48 : 204,
    y: p.y + 18,
  })
);

export const WokwiMultiSlotCanvas: React.FC<{
  kanvasContainerRef: React.RefObject<HTMLDivElement | null>;
  getarMerahRangkaian: boolean;
  statusVerifikasi: "belum" | "gagal_rangkaian" | "gagal_kode" | "lulus";
  simulasiAktif: boolean;
  detakSimulasi: number;
  slot1Esp32Terpasang: boolean;
  setSlot1Esp32Terpasang: (v: boolean) => void;
  daftarSlotPeriferal: DefinisiSlotPeriferalMultiPin[];
  slotPeriferalTerpasangMap: Record<
    number,
    { terpasang: boolean; namaKartu: string; idKartu: string }
  >;
  handleDropKeSlotTertentu: (nomorSlot: number) => void;
  itemSedangDiDrag: any;
  pesanGudang: string;
  setPesanGudang: (msg: string) => void;
  totalKomponenWajib: number;
  slotPeriferalKosongBerikutnya: DefinisiSlotPeriferalMultiPin | null;
  sambunganBerkedipTarget: AturanSambunganKabelReal | null;
  semuaSambunganWajibLevelIni: AturanSambunganKabelReal[];
  kabelTerpasangList: KabelMultiPinTersambung[];
  setKabelTerpasangList: React.Dispatch<
    React.SetStateAction<KabelMultiPinTersambung[]>
  >;
  pinAwalDiklik: TitikPinFisik | null;
  setPinAwalDiklik: (p: TitikPinFisik | null) => void;
  posisiKursorSvg: { x: number; y: number };
  setPosisiKursorSvg: (pos: { x: number; y: number }) => void;
  handleKlikTitikPinFisik: (e: React.MouseEvent, pin: TitikPinFisik) => void;
  tampilkanBayanganPanduan: boolean;
  semuaKomponenSudahDitaruh: boolean;
  pinYangSalahAtauKurangIds: string[];
  fisika: ParameterFisikaInteraktif;
  setFisika: React.Dispatch<React.SetStateAction<ParameterFisikaInteraktif>>;
}> = ({
  kanvasContainerRef,
  getarMerahRangkaian,
  statusVerifikasi,
  simulasiAktif,
  detakSimulasi,
  slot1Esp32Terpasang,
  setSlot1Esp32Terpasang,
  daftarSlotPeriferal,
  slotPeriferalTerpasangMap,
  handleDropKeSlotTertentu,
  itemSedangDiDrag,
  pesanGudang,
  setPesanGudang,
  totalKomponenWajib,
  slotPeriferalKosongBerikutnya,
  sambunganBerkedipTarget,
  semuaSambunganWajibLevelIni,
  kabelTerpasangList,
  setKabelTerpasangList,
  pinAwalDiklik,
  setPinAwalDiklik,
  posisiKursorSvg,
  setPosisiKursorSvg,
  handleKlikTitikPinFisik,
  tampilkanBayanganPanduan,
  semuaKomponenSudahDitaruh,
  pinYangSalahAtauKurangIds,
  fisika,
  setFisika,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const infoResistor = hitungGelangResistorModular(fisika.nilaiOhmResistor);

  const lebarKanvas = 920;
  const tinggiKanvas = Math.max(
    300,
    daftarSlotPeriferal.reduce((m, s) => Math.max(m, s.boxY + s.boxH + 28), 300)
  );

  const semuaTitikPinPeta: Record<string, TitikPinFisik> = {};
  PIN_ESP32_KANVAS_LEBAR.forEach((p) => {
    semuaTitikPinPeta[p.idPin] = p;
  });
  daftarSlotPeriferal.forEach((slot) => {
    slot.daftarPinKomponenIni.forEach((p) => {
      semuaTitikPinPeta[p.idPin] = p;
    });
  });

  const hapusSatuKabelTertentu = (indexKabel: number) => {
    const kabelDihapus = kabelTerpasangList[indexKabel];
    const l1 =
      semuaTitikPinPeta[kabelDihapus?.pinAsalId]?.labelPin ||
      kabelDihapus?.pinAsalId;
    const l2 =
      semuaTitikPinPeta[kabelDihapus?.pinTujuanId]?.labelPin ||
      kabelDihapus?.pinTujuanId;

    setKabelTerpasangList((prev) =>
      prev.filter((_, idx) => idx !== indexKabel)
    );
    setPesanGudang(`🗑️ 1 Kabel (${l1} ↔ ${l2}) berhasil dilepas!`);
  };

  const handleMouseMoveSvg = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pinAwalDiklik || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = lebarKanvas / rect.width;
    const scaleY = tinggiKanvas / rect.height;
    setPosisiKursorSvg({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  };

  const pinAsalBerkedipObj = sambunganBerkedipTarget
    ? semuaTitikPinPeta[sambunganBerkedipTarget.pinAsalId]
    : null;
  const pinTujuanBerkedipObj = sambunganBerkedipTarget
    ? semuaTitikPinPeta[sambunganBerkedipTarget.pinTujuanId]
    : null;

  return (
    <div
      ref={kanvasContainerRef}
      className={`bg-[#090d16] rounded-3xl border-2 p-4 sm:p-5 relative overflow-hidden shadow-2xl transition ${
        getarMerahRangkaian
          ? "animate-error-shake border-rose-500 bg-rose-950/20"
          : statusVerifikasi === "gagal_rangkaian"
          ? "border-rose-500"
          : simulasiAktif
          ? "border-emerald-400"
          : "border-slate-800"
      }`}
    >
      {/* Baris Indikator Slot */}
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        <div
          onClick={() => {
            if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
          }}
          className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
            slot1Esp32Terpasang
              ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
              : "bg-amber-950/40 border-amber-400 text-amber-200 animate-pulse"
          }`}
        >
          <span className="truncate">Slot #1: ESP32 DevKit V1</span>
          <span className="shrink-0 ml-1">
            {slot1Esp32Terpasang ? "✓ Terpasang" : "📦 Tarik ke Sini"}
          </span>
        </div>

        {daftarSlotPeriferal.map((slot) => {
          const sudah = slotPeriferalTerpasangMap[slot.nomorSlot]?.terpasang;
          return (
            <div
              key={slot.nomorSlot}
              onClick={() => {
                if (itemSedangDiDrag) handleDropKeSlotTertentu(slot.nomorSlot);
              }}
              className={`px-3 py-2 rounded-xl border font-semibold flex items-center justify-between cursor-pointer ${
                sudah
                  ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300"
                  : "bg-sky-950/40 border-sky-400 text-sky-200 animate-pulse"
              }`}
            >
              <span className="truncate">
                Slot #{slot.nomorSlot}: {slot.namaTarget}
              </span>
              <span className="shrink-0 ml-1">
                {sudah ? "✓ Terpasang" : "📦 Tarik ke Sini"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Banner Panduan Langkah */}
      <div className="mb-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-300 flex flex-wrap justify-between items-center gap-2">
        <span>
          {pesanGudang ||
            (!slot1Esp32Terpasang
              ? `👉 Langkah 1/${totalKomponenWajib}: Tarik 'ESP32 DevKit V1' dari Gudang ke kotak [Slot #1] di sebelah kiri!`
              : slotPeriferalKosongBerikutnya
              ? `👉 Langkah Berikutnya: Tarik '${slotPeriferalKosongBerikutnya.namaTarget}' dari Gudang ke kotak [Slot #${slotPeriferalKosongBerikutnya.nomorSlot}] di sebelah kanan!`
              : sambunganBerkedipTarget
              ? `🔌 Hubungkan Semua Kaki Pin (${kabelTerpasangList.length}/${semuaSambunganWajibLevelIni.length}): ${sambunganBerkedipTarget.keteranganJalur}`
              : `✅ Seluruh ${totalKomponenWajib} Komponen & Semua ${semuaSambunganWajibLevelIni.length} Kaki Pin Sudah Terhubung! Silakan jalankan program di bawah.`)}
        </span>
      </div>

      {/* KANVAS UTAMA SUPER LEGA (LEBAR 920PX, TINGGI DINAMIS) */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${lebarKanvas} ${tinggiKanvas}`}
        onMouseMove={handleMouseMoveSvg}
        onClick={() => {
          if (pinAwalDiklik) setPinAwalDiklik(null);
        }}
        className="w-full min-h-[340px] sm:min-h-[430px] select-none"
      >
        {/* Grid Titik Breadboard */}
        {Array.from({ length: 32 }).map((_, gx) =>
          Array.from({ length: Math.ceil(tinggiKanvas / 28) }).map((__, gy) => (
            <circle
              key={`${gx}-${gy}`}
              cx={20 + gx * 28}
              cy={20 + gy * 28}
              r={1.6}
              fill="#1e293b"
            />
          ))
        )}

        {/* =============================================================== */}
        {/* SLOT #1: PAPAN ESP32 DENGAN HEADER WROOM DI ATAS (TIDAK TERTUTUP) */}
        {/* =============================================================== */}
        {!slot1Esp32Terpasang ? (
          <g
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDropKeSlotTertentu(1);
            }}
            onClick={() => {
              if (itemSedangDiDrag) handleDropKeSlotTertentu(1);
              else setSlot1Esp32Terpasang(true);
            }}
            className="cursor-pointer"
          >
            <rect
              x={44}
              y={20}
              width={164}
              height={236}
              rx={16}
              fill="rgba(250, 204, 21, 0.08)"
              stroke="#facc15"
              strokeWidth={2.5}
              strokeDasharray="8 5"
            >
              <animate
                attributeName="opacity"
                values="0.35;1;0.35"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </rect>
            <text
              x={126}
              y={122}
              textAnchor="middle"
              fill="#facc15"
              fontSize="11.5"
              fontWeight="bold"
            >
              📦 SLOT #1 (MCU):
            </text>
            <text
              x={126}
              y={142}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              ESP32 DevKit V1
            </text>
          </g>
        ) : (
          <g>
            {/* Badan PCB ESP32 */}
            <rect
              x={48}
              y={20}
              width={156}
              height={236}
              rx={12}
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth={2.2}
            />
            {/* Kaleng Perak ESP-WROOM-32 diletakkan di y=28..60 (di atas deretan pin agar tidak pernah tertutup!) */}
            <rect
              x={76}
              y={27}
              width={100}
              height={32}
              rx={5}
              fill="#cbd5e1"
              stroke="#475569"
            />
            <text
              x={126}
              y={47}
              textAnchor="middle"
              fill="#0f172a"
              fontSize="9.5"
              fontWeight="bold"
            >
              ESP-WROOM-32
            </text>

            {/* LED Indikator & Port USB di Bawah */}
            <circle cx={108} cy={234} r={4} fill="#ef4444" />
            <circle
              cx={144}
              cy={234}
              r={5.5}
              fill={
                (simulasiAktif || daftarSlotPeriferal.length === 0) &&
                detakSimulasi % 2 === 0
                  ? "#38bdf8"
                  : "#1e3a8a"
              }
              stroke="#ffffff"
              strokeWidth={1.2}
            />
            <rect
              x={106}
              y={244}
              width={40}
              height={14}
              rx={3}
              fill="#94a3b8"
            />

            {/* Titik Kaki Pin ESP32 */}
            {PIN_ESP32_KANVAS_LEBAR.map((pin) => {
              const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
              const harusBerkedip =
                tampilkanBayanganPanduan &&
                semuaKomponenSudahDitaruh &&
                (sambunganBerkedipTarget?.pinAsalId === pin.idPin ||
                  sambunganBerkedipTarget?.pinTujuanId === pin.idPin);
              const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                pin.idPin
              );
              const isKanan = pin.x > 126;

              return (
                <g
                  key={pin.idPin}
                  onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                  className="cursor-pointer"
                >
                  {adalahPinSalah && (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={15}
                      fill="rgba(244, 63, 94, 0.35)"
                      stroke="#f43f5e"
                      strokeWidth={3}
                    >
                      <animate
                        attributeName="r"
                        values="7;17;7"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {harusBerkedip && !adalahPinSalah && (
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={14}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth={3}
                    >
                      <animate
                        attributeName="r"
                        values="7;16;7"
                        dur="0.85s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  <rect
                    x={isKanan ? pin.x - 62 : pin.x + 11}
                    y={pin.y - 8}
                    width={51}
                    height={16}
                    rx={4}
                    fill={
                      adalahPinSalah
                        ? "#e11d48"
                        : harusBerkedip
                        ? "#facc15"
                        : "#0f172a"
                    }
                    opacity={0.96}
                  />
                  <text
                    x={isKanan ? pin.x - 36.5 : pin.x + 36.5}
                    y={pin.y + 3}
                    textAnchor="middle"
                    fill={
                      adalahPinSalah
                        ? "#ffffff"
                        : harusBerkedip
                        ? "#0f172a"
                        : "#f8fafc"
                    }
                    fontSize="8.2"
                    fontWeight="bold"
                  >
                    {pin.labelPin}
                  </text>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={sedangDipegang || adalahPinSalah ? 9 : 6.5}
                    fill={
                      adalahPinSalah
                        ? "#f43f5e"
                        : sedangDipegang
                        ? "#ffffff"
                        : harusBerkedip
                        ? "#facc15"
                        : pin.warnaPin
                    }
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* =============================================================== */}
        {/* SLOT KOMPONEN PERIFERAL (LABEL PIN DI DALAM KOTAK AGAR RAPI!)   */}
        {/* =============================================================== */}
        {daftarSlotPeriferal.map((slot) => {
          const infoTerpasang = slotPeriferalTerpasangMap[slot.nomorSlot];
          const sudahTerpasang = Boolean(infoTerpasang?.terpasang);

          if (!sudahTerpasang) {
            return (
              <g
                key={slot.nomorSlot}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropKeSlotTertentu(slot.nomorSlot);
                }}
                onClick={() => {
                  if (itemSedangDiDrag)
                    handleDropKeSlotTertentu(slot.nomorSlot);
                  else
                    setPesanGudang(
                      `👆 Tarik (Drag) kartu '${slot.namaTarget}' dari Gudang Komponen di atas ke kotak Slot #${slot.nomorSlot} ini!`
                    );
                }}
                className="cursor-pointer"
              >
                <rect
                  x={slot.boxX}
                  y={slot.boxY}
                  width={slot.boxW}
                  height={slot.boxH}
                  rx={14}
                  fill="rgba(56, 189, 248, 0.07)"
                  stroke={
                    slotPeriferalKosongBerikutnya?.nomorSlot === slot.nomorSlot
                      ? "#facc15"
                      : "#38bdf8"
                  }
                  strokeWidth={2.2}
                  strokeDasharray="7 5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.4;1;0.4"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </rect>
                <text
                  x={slot.boxX + slot.boxW / 2}
                  y={slot.boxY + slot.boxH / 2 - 6}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  📦 SLOT #{slot.nomorSlot} (BELUM DITARIK):
                </text>
                <text
                  x={slot.boxX + slot.boxW / 2}
                  y={slot.boxY + slot.boxH / 2 + 13}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  {slot.namaTarget}
                </text>
              </g>
            );
          }

          return (
            <g key={slot.nomorSlot}>
              {/* Kotak Utama Slot Komponen */}
              <rect
                x={slot.boxX}
                y={slot.boxY}
                width={slot.boxW}
                height={slot.boxH}
                rx={14}
                fill={simulasiAktif ? "#064e3b" : "#111827"}
                stroke={simulasiAktif ? "#34d399" : "#475569"}
                strokeWidth={2.2}
              />

              {/* Header Judul Komponen di Bagian Atas Dalam Kotak */}
              <rect
                x={slot.boxX + 12}
                y={slot.boxY + 8}
                width={slot.boxW - 24}
                height={20}
                rx={5}
                fill="#090d16"
              />
              <text
                x={slot.boxX + 20}
                y={slot.boxY + 21}
                fill="#38bdf8"
                fontSize="9"
                fontWeight="bold"
              >
                SLOT #{slot.nomorSlot}: {(infoTerpasang.namaKartu || slot.namaTarget).slice(0, 26)}
              </text>

              {/* Gambar Ikon Komponen di Sisi Kanan Dalam Kotak (Tidak Tertabrak Label Pin!) */}
              <svg
                x={slot.boxX + slot.boxW - 88}
                y={slot.boxY + 32}
                width={74}
                height={66}
                viewBox="0 0 64 56"
              >
                <MiniaturSvgGudang48
                  idItem={infoTerpasang.idKartu || slot.idGambarMiniatur}
                  namaItem=""
                  nilaiOhmResistor={fisika.nilaiOhmResistor}
                />
              </svg>

              {/* Render Titik Pin di Tepi Kiri Kotak + Label Pin di DALAM Kiri Kotak (ZERO OVERLAP!) */}
              {slot.daftarPinKomponenIni.map((pin) => {
                const sedangDipegang = pinAwalDiklik?.idPin === pin.idPin;
                const harusBerkedip =
                  tampilkanBayanganPanduan &&
                  semuaKomponenSudahDitaruh &&
                  (sambunganBerkedipTarget?.pinAsalId === pin.idPin ||
                    sambunganBerkedipTarget?.pinTujuanId === pin.idPin);
                const adalahPinSalah = pinYangSalahAtauKurangIds.includes(
                  pin.idPin
                );

                return (
                  <g
                    key={pin.idPin}
                    onClick={(e) => handleKlikTitikPinFisik(e, pin)}
                    className="cursor-pointer"
                  >
                    {/* Garis Kaki Logam Pendek ke Dalam */}
                    <line
                      x1={pin.x}
                      y1={pin.y}
                      x2={pin.x + 14}
                      y2={pin.y}
                      stroke="#94a3b8"
                      strokeWidth={3}
                    />

                    {/* Kotak Label Pin DI DALAM KOTAK KOMPONEN (Mulai dari pin.x + 14 ke kanan) */}
                    <rect
                      x={pin.x + 14}
                      y={pin.y - 10}
                      width={136}
                      height={20}
                      rx={5}
                      fill={
                        adalahPinSalah
                          ? "#e11d48"
                          : harusBerkedip
                          ? "#facc15"
                          : "#0f172a"
                      }
                      stroke={harusBerkedip ? "#ffffff" : "#334155"}
                      strokeWidth={1.2}
                    />
                    <text
                      x={pin.x + 82}
                      y={pin.y + 3.5}
                      textAnchor="middle"
                      fill={
                        adalahPinSalah
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#0f172a"
                          : "#f8fafc"
                      }
                      fontSize="8.8"
                      fontWeight="bold"
                    >
                      {pin.labelPin}
                    </text>

                    {adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={16}
                        fill="rgba(244, 63, 94, 0.35)"
                        stroke="#f43f5e"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="8;18;8"
                          dur="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    {harusBerkedip && !adalahPinSalah && (
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={15}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth={3}
                      >
                        <animate
                          attributeName="r"
                          values="7;16;7"
                          dur="0.85s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Bulatan Titik Pin Tepat di Garis Tepi Kiri Kotak */}
                    <circle
                      cx={pin.x}
                      cy={pin.y}
                      r={sedangDipegang || adalahPinSalah ? 9 : 7}
                      fill={
                        adalahPinSalah
                          ? "#f43f5e"
                          : sedangDipegang
                          ? "#ffffff"
                          : harusBerkedip
                          ? "#facc15"
                          : pin.warnaPin
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* GARIS BAYANGAN PANDUAN ANTAR-KAKI */}
        {semuaKomponenSudahDitaruh &&
          tampilkanBayanganPanduan &&
          pinAsalBerkedipObj &&
          pinTujuanBerkedipObj && (
            <path
              pointerEvents="none"
              d={
                pinAsalBerkedipObj.x === pinTujuanBerkedipObj.x
                  ? `M ${pinAsalBerkedipObj.x} ${pinAsalBerkedipObj.y} C ${
                      pinAsalBerkedipObj.x - 55
                    } ${pinAsalBerkedipObj.y}, ${
                      pinTujuanBerkedipObj.x - 55
                    } ${pinTujuanBerkedipObj.y}, ${pinTujuanBerkedipObj.x} ${
                      pinTujuanBerkedipObj.y
                    }`
                  : `M ${pinAsalBerkedipObj.x} ${pinAsalBerkedipObj.y} C ${
                      (pinAsalBerkedipObj.x + pinTujuanBerkedipObj.x) / 2
                    } ${pinAsalBerkedipObj.y - 20}, ${
                      (pinAsalBerkedipObj.x + pinTujuanBerkedipObj.x) / 2
                    } ${pinTujuanBerkedipObj.y + 20}, ${
                      pinTujuanBerkedipObj.x
                    } ${pinTujuanBerkedipObj.y}`
              }
              fill="none"
              stroke="#facc15"
              strokeWidth={4}
              strokeDasharray="8 6"
              opacity={0.85}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="28"
                to="0"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
          )}

        {/* KABEL MENGIKUTI MOUSE */}
        {pinAwalDiklik && (
          <path
            pointerEvents="none"
            d={`M ${pinAwalDiklik.x} ${pinAwalDiklik.y} Q ${
              (pinAwalDiklik.x + posisiKursorSvg.x) / 2
            } ${Math.min(pinAwalDiklik.y, posisiKursorSvg.y) - 20}, ${
              posisiKursorSvg.x
            } ${posisiKursorSvg.y}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={4}
            strokeDasharray="5 4"
          />
        )}

        {/* KABEL YANG SUDAH TERSAMBUNG (KLIK UNTUK HAPUS 1 KABEL SAJA) */}
        {kabelTerpasangList.map((k, idx) => {
          const p1 = semuaTitikPinPeta[k.pinAsalId];
          const p2 = semuaTitikPinPeta[k.pinTujuanId];
          if (!p1 || !p2) return null;

          const adalahValid = semuaSambunganWajibLevelIni.some(
            (w) =>
              (w.pinAsalId === k.pinAsalId &&
                w.pinTujuanId === k.pinTujuanId) ||
              (w.pinAsalId === k.pinTujuanId &&
                w.pinTujuanId === k.pinAsalId)
          );

          const isVertikal = p1.x === p2.x;
          const midX = isVertikal ? p1.x - 42 : (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const pathData = isVertikal
            ? `M ${p1.x} ${p1.y} C ${p1.x - 55} ${p1.y}, ${p2.x - 55} ${
                p2.y
              }, ${p2.x} ${p2.y}`
            : `M ${p1.x} ${p1.y} C ${(p1.x + p2.x) / 2} ${p1.y}, ${
                (p1.x + p2.x) / 2
              } ${p2.y}, ${p2.x} ${p2.y}`;

          return (
            <g
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                hapusSatuKabelTertentu(idx);
              }}
              className="cursor-pointer"
            >
              <path
                d={pathData}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
              />
              <path
                d={pathData}
                fill="none"
                stroke={adalahValid ? k.warna : "#f43f5e"}
                strokeWidth={4.5}
                strokeDasharray={adalahValid ? "none" : "6 4"}
                strokeLinecap="round"
              />
              <circle
                cx={midX}
                cy={midY}
                r={8.5}
                fill={adalahValid ? "#0f172a" : "#e11d48"}
                stroke={adalahValid ? k.warna : "#ffffff"}
                strokeWidth={1.5}
              />
              <text
                x={midX}
                y={midY + 3}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="bold"
              >
                ✕
              </text>
            </g>
          );
        })}
      </svg>

      {/* BARIS CHIP DAFTAR KABEL INDIVIDUAL */}
      <div className="mt-3 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-sky-400 flex items-center gap-1">
            <Cable className="w-4 h-4" /> Kabel Terpasang (Klik ✕ untuk hapus 1 kabel saja):
          </span>

          {kabelTerpasangList.length === 0 ? (
            <span className="text-slate-400 italic">
              Belum ada kabel. Klik titik kaki ke-1 lalu klik titik kaki ke-2 di kanvas!
            </span>
          ) : (
            kabelTerpasangList.map((k, idx) => {
              const label1 =
                semuaTitikPinPeta[k.pinAsalId]?.labelPin || k.pinAsalId;
              const label2 =
                semuaTitikPinPeta[k.pinTujuanId]?.labelPin || k.pinTujuanId;
              const adalahValid = semuaSambunganWajibLevelIni.some(
                (w) =>
                  (w.pinAsalId === k.pinAsalId &&
                    w.pinTujuanId === k.pinTujuanId) ||
                  (w.pinAsalId === k.pinTujuanId &&
                    w.pinTujuanId === k.pinAsalId)
              );

              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 ${
                    adalahValid
                      ? "bg-slate-950 border-emerald-500/50 text-emerald-300"
                      : "bg-rose-950 border-rose-500 text-rose-200 animate-pulse"
                  }`}
                >
                  <span>
                    {adalahValid ? "✓" : "❌ SALAH:"} {label1} ↔ {label2}
                  </span>
                  <button
                    type="button"
                    onClick={() => hapusSatuKabelTertentu(idx)}
                    className="px-1.5 py-0.5 rounded bg-rose-600/80 hover:bg-rose-500 text-white font-black cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              );
            })
          )}
        </div>

        {kabelTerpasangList.length > 1 && (
          <button
            type="button"
            onClick={() => setKabelTerpasangList([])}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3 h-3" /> Hapus Semua
          </button>
        )}
      </div>

      {/* PANEL SIMULATOR FISIKA */}
      <div className="mt-3 bg-slate-900/95 p-4 rounded-2xl border border-emerald-500/40 space-y-3 text-xs">
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" /> Pengatur Parameter Fisika &amp; Animasi Komponen Live:
          </span>
          <span className="font-mono text-amber-300">
            Resistor: <strong>{infoResistor.labelFormatted}</strong> ({infoResistor.teksGelang})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">💡 Terang/Redup LED (PWM):</span>
              <span className="text-amber-300">
                {Math.round((fisika.pwmLedBrightness / 255) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={255}
              value={fisika.pwmLedBrightness}
              onChange={(e) =>
                setFisika((f) => ({
                  ...f,
                  pwmLedBrightness: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">🎨 Nilai &amp; Gelang Resistor:</span>
              <span className="text-emerald-400">
                {infoResistor.labelFormatted}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PILIHAN_OHM_RESISTOR.map((nilai) => (
                <button
                  key={nilai}
                  type="button"
                  onClick={() =>
                    setFisika((f) => ({ ...f, nilaiOhmResistor: nilai }))
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    fisika.nilaiOhmResistor === nilai
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {nilai >= 1000 ? `${nilai / 1000}kΩ` : `${nilai}Ω`}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">🔥 Suhu Panas &amp; Asap PPM:</span>
              <span className="text-rose-400">
                {fisika.suhuCelcius}°C | {fisika.kadarGasPpm} PPM
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min={20}
                max={55}
                value={fisika.suhuCelcius}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    suhuCelcius: Number(e.target.value),
                  }))
                }
                className="w-1/2"
              />
              <input
                type="range"
                min={150}
                max={950}
                value={fisika.kadarGasPpm}
                onChange={(e) =>
                  setFisika((f) => ({
                    ...f,
                    kadarGasPpm: Number(e.target.value),
                  }))
                }
                className="w-1/2"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">📡 Jarak Objek Ultrasonik:</span>
              <span className="text-sky-400">{fisika.jarakUltrasonikCm} cm</span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              value={fisika.jarakUltrasonikCm}
              onChange={(e) =>
                setFisika((f) => ({
                  ...f,
                  jarakUltrasonikCm: Number(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};