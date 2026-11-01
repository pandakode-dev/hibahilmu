"use client";

import React from "react";
import { Sliders, CopyPlus, Trash2, Power, Info } from "lucide-react";
import { NodeKomponenKanvas } from "./ElectronicAndIotCanvas";
import { ResistorVisualSvg } from "./ResistorVisualSvg";
import {
  ambilLayoutFisikKomponen,
  ambilKonfigurasiRentangKomponen,
  warnaTitikPin,
  TitikPinFisik,
} from "./pinoutDefinitions";
import { ZonaRuanganFisik } from "./PhysicalRoomsLayer";

interface InspectorSidebarProps {
  ukuranKanvasPenuh: boolean;
  komponenTerpilih: NodeKomponenKanvas | null;
  ruanganKomponenTerpilih: ZonaRuanganFisik | null;
  onDuplikatKomponen: (node: NodeKomponenKanvas) => void;
  onHapusKomponen: (id: string) => void;
  onUpdateProperti: (
    id: string,
    perubahan: Partial<NodeKomponenKanvas>
  ) => void;
  onMulaiTarikKabelDariPin: (
    node: NodeKomponenKanvas,
    pin: TitikPinFisik
  ) => void;
}

export const ComponentInspectorSidebar: React.FC<InspectorSidebarProps> = ({
  ukuranKanvasPenuh,
  komponenTerpilih,
  ruanganKomponenTerpilih,
  onDuplikatKomponen,
  onHapusKomponen,
  onUpdateProperti,
  onMulaiTarikKabelDariPin,
}) => {
  const layoutTerpilih = komponenTerpilih
    ? ambilLayoutFisikKomponen(komponenTerpilih.tipe)
    : null;
  const rentangTerpilih = komponenTerpilih
    ? ambilKonfigurasiRentangKomponen(komponenTerpilih.tipe)
    : null;

  return (
    <div
      className={`${
        ukuranKanvasPenuh ? "lg:col-span-12" : "lg:col-span-4"
      } bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-5 max-h-[640px] overflow-y-auto`}
    >
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <span className="font-black text-xs uppercase text-emerald-400 flex items-center gap-1.5">
          <Sliders className="w-4 h-4" /> Inspector &amp; Lokasi Ruangan
        </span>
        {komponenTerpilih && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onDuplikatKomponen(komponenTerpilih)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer"
            >
              <CopyPlus className="w-3 h-3" /> Duplikat
            </button>
            <button
              type="button"
              onClick={() => onHapusKomponen(komponenTerpilih.id)}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Hapus
            </button>
          </div>
        )}
      </div>

      {komponenTerpilih && layoutTerpilih && rentangTerpilih ? (
        <div className="space-y-4 text-xs">
          <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-between">
            <span className="text-slate-300">Lokasi Fisik:</span>
            <span className="text-amber-300 font-black">
              {ruanganKomponenTerpilih
                ? `${ruanganKomponenTerpilih.ikon} ${ruanganKomponenTerpilih.namaRuangan}`
                : "📍 Area Terbuka (Diluar Ruangan)"}
            </span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">
              Nama Komponen Terpilih:
            </label>
            <input
              type="text"
              value={komponenTerpilih.label}
              onChange={(e) =>
                onUpdateProperti(komponenTerpilih.id, {
                  label: e.target.value,
                })
              }
              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
            />
          </div>

          {komponenTerpilih.tipe === "resistor" ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-3">
              <div className="font-black text-amber-300 uppercase text-[11px]">
                🎨 Nilai Hambatan &amp; Gelang Warna
              </div>
              <div className="flex justify-center">
                <ResistorVisualSvg
                  nilaiOhm={komponenTerpilih.nilaiResistor || 1000}
                  ukuran="besar"
                />
              </div>
              <input
                type="number"
                min={1}
                max={10000000}
                value={komponenTerpilih.nilaiResistor || 1000}
                onChange={(e) =>
                  onUpdateProperti(komponenTerpilih.id, {
                    nilaiResistor: Math.max(1, Number(e.target.value)),
                  })
                }
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 font-mono font-black text-amber-300"
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
              <div className="text-[11px] font-black text-emerald-300 uppercase">
                ⚙️ {rentangTerpilih.labelParameter}
              </div>

              {rentangTerpilih.punyaSlider ? (
                <>
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="text-slate-400">
                      Min: {rentangTerpilih.min} {rentangTerpilih.satuan}
                    </span>
                    <span className="text-base font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-amber-400/40">
                      {komponenTerpilih.nilaiSensor ??
                        rentangTerpilih.defaultVal}{" "}
                      {rentangTerpilih.satuan}
                    </span>
                    <span className="text-slate-400">
                      Max: {rentangTerpilih.max} {rentangTerpilih.satuan}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={rentangTerpilih.min}
                    max={rentangTerpilih.max}
                    step={rentangTerpilih.step}
                    value={
                      komponenTerpilih.nilaiSensor ?? rentangTerpilih.defaultVal
                    }
                    onChange={(e) =>
                      onUpdateProperti(komponenTerpilih.id, {
                        nilaiSensor: Number(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 font-semibold">
                  ⚡ Komponen Digital Sakelar <b>ON / OFF</b>.
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-relaxed">
                {rentangTerpilih.catatanFisik}
              </p>

              <button
                type="button"
                onClick={() =>
                  onUpdateProperti(komponenTerpilih.id, {
                    nyala: !komponenTerpilih.nyala,
                  })
                }
                className={`w-full py-2.5 rounded-xl font-black flex items-center justify-center gap-1.5 cursor-pointer transition ${
                  komponenTerpilih.nyala
                    ? "bg-emerald-500 text-slate-950 shadow-lg"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                <Power className="w-4 h-4" />
                {komponenTerpilih.nyala
                  ? "STATUS: ON / HIGH (AKTIF)"
                  : "STATUS: OFF / LOW (MATI)"}
              </button>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5">
            <span className="font-black text-indigo-300 uppercase text-[11px] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Daftar &amp; Keterangan Pin (
              {layoutTerpilih.pins.length} Titik)
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {layoutTerpilih.pins.map((p) => (
                <div
                  key={p.idPin}
                  onClick={() => onMulaiTarikKabelDariPin(komponenTerpilih, p)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer space-y-0.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-amber-300 flex items-center gap-1.5">
                      <span
                        style={{ backgroundColor: warnaTitikPin(p.kategori) }}
                        className="w-2.5 h-2.5 rounded-full inline-block"
                      />
                      #{p.nomorPin} {p.nama}
                    </span>
                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                      {p.sisi}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 pl-4">
                    {p.keterangan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400">
          Klik salah satu komponen di kanvas untuk melihat parameter dan daftar
          pinout-nya.
        </div>
      )}
    </div>
  );
};