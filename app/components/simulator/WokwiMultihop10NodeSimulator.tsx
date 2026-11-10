"use client";

import React, { useState, useEffect } from "react";
import {
  BatteryCharging,
  MapPin,
  Thermometer,
  Sprout,
  Play,
  Square,
  RefreshCw,
} from "lucide-react";
import {
  Esp32MeshNodeData,
  INITIAL_10_NODES_DATA,
} from "./wokwiCurriculumData";

export const WokwiMultihop10NodeSimulator: React.FC<{
  onTambahXp?: (xp: number) => void;
}> = ({ onTambahXp }) => {
  const [nodes, setNodes] = useState<Esp32MeshNodeData[]>(INITIAL_10_NODES_DATA);
  const [nodeTerpilihId, setNodeTerpilihId] = useState<number>(1);
  const [simulasiMeshBerjalan, setSimulasiMeshBerjalan] =
    useState<boolean>(true);
  const [batasMinNitrogen, setBatasMinNitrogen] = useState<number>(100);

  const [nodeAsalPaket, setNodeAsalPaket] = useState<number>(1);
  const [nodeHopAktif, setNodeHopAktif] = useState<number>(1);
  const [jejakHopSaatIni, setJejakHopSaatIni] = useState<number[]>([1]);
  const [totalPaketTerkirimCloud, setTotalPaketTerkirimCloud] =
    useState<number>(142);
  const [logMeshGateway, setLogMeshGateway] = useState<string[]>([
    "[GATEWAY NODE #10] Terhubung ke Wi-Fi & Broker Cloud https://hibahilmu.my.id/api/iot/cloud",
    "[MESH ROUTING] Topologi 10-Node ESP-NOW Aktif (Node 1 -> 2 -> ... -> Node 10 Internet)",
  ]);

  const nodeTerpilih =
    nodes.find((n) => n.nodeId === nodeTerpilihId) || nodes[0];

  const cariNodeAktifBerikutnya = (
    dariNodeId: number,
    daftarNode: Esp32MeshNodeData[]
  ): number => {
    for (let kandidat = dariNodeId + 1; kandidat <= 10; kandidat++) {
      const target = daftarNode.find((n) => n.nodeId === kandidat);
      if (target && target.aktif && target.teganganVolt >= 3.25) {
        return kandidat;
      }
    }
    return 10;
  };

  useEffect(() => {
    if (!simulasiMeshBerjalan) return;

    const timer = setInterval(() => {
      setNodeHopAktif((prevHop) => {
        if (prevHop >= 10) {
          const asalObj =
            nodes.find((n) => n.nodeId === nodeAsalPaket) || nodes[0];
          const waktu = new Date().toLocaleTimeString("id-ID", {
            hour12: false,
          });
          const ruteTeks = jejakHopSaatIni.map((id) => `N${id}`).join(" ➔ ");

          const barisLogBaru = `[${waktu}] 🌐 NODE #10 UPLOAD | Asal: Node #${asalObj.nodeId} | Rute: ${ruteTeks} | Suhu: ${asalObj.suhuUdara.toFixed(1)}°C | NPK: ${asalObj.npkNitrogen}-${asalObj.npkFosfor}-${asalObj.npkKalium} | Batt: ${asalObj.teganganVolt.toFixed(2)}V (${asalObj.bateraiPersen}%) | GPS: ${asalObj.gpsLat.toFixed(4)}, ${asalObj.gpsLng.toFixed(4)}`;

          setLogMeshGateway((prevLogs) => [
            barisLogBaru,
            ...prevLogs.slice(0, 12),
          ]);
          setTotalPaketTerkirimCloud((c) => c + 1);

          const nextOrigin = (nodeAsalPaket % 9) + 1;
          const nodeOriginValid = nodes.find(
            (n) =>
              n.nodeId === nextOrigin && n.aktif && n.teganganVolt >= 3.25
          )
            ? nextOrigin
            : 1;

          setNodeAsalPaket(nodeOriginValid);
          setJejakHopSaatIni([nodeOriginValid]);
          return nodeOriginValid;
        } else {
          const nextHop = cariNodeAktifBerikutnya(prevHop, nodes);
          setJejakHopSaatIni((prevJejak) =>
            prevJejak.includes(nextHop) ? prevJejak : [...prevJejak, nextHop]
          );
          return nextHop;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, [simulasiMeshBerjalan, nodes, nodeAsalPaket, jejakHopSaatIni]);

  const updateSensorNode = (
    nodeId: number,
    perubahan: Partial<Esp32MeshNodeData>
  ) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.nodeId !== nodeId) return n;
        const updated = { ...n, ...perubahan };
        if (perubahan.teganganVolt !== undefined) {
          updated.bateraiPersen = Math.min(
            100,
            Math.max(
              0,
              Math.round(((perubahan.teganganVolt - 3.2) / (4.2 - 3.2)) * 100)
            )
          );
        }
        return updated;
      })
    );
  };

  const kirimPaketUjiDariNodeIni = (idAsal: number) => {
    setNodeAsalPaket(idAsal);
    setNodeHopAktif(idAsal);
    setJejakHopSaatIni([idAsal]);
    setSimulasiMeshBerjalan(true);
    if (onTambahXp) onTambahXp(15);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-5 rounded-3xl border-2 border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/40">
              PROYEK 8 • WIRELESS SENSOR NETWORK (10-NODE ESP32 MULTI-HOP)
            </span>
            <h3 className="text-lg sm:text-xl font-black text-amber-300 mt-1">
              Simulasi Estafet 10-Node ESP32 (Suhu, Pupuk NPK, Tegangan, Baterai &amp; GPS ➔ Node 10 Internet)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulasiMeshBerjalan(!simulasiMeshBerjalan)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow ${
                simulasiMeshBerjalan
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-rose-600 text-white"
              }`}
            >
              {simulasiMeshBerjalan ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" /> RUNNING (Hentikan)
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> JALANKAN ESTAFET
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setNodes(INITIAL_10_NODES_DATA);
                setJejakHopSaatIni([1]);
                setNodeAsalPaket(1);
                setNodeHopAktif(1);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset 10 Node
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black">
              📡 RUTE LOMPATAN PAKET:
            </span>
            <span className="font-mono text-sky-300 font-bold">
              {jejakHopSaatIni.map((id) => `Node ${id}`).join(" ➔ ")}{" "}
              {nodeHopAktif === 10 ? "➔ ☁️ INTERNET DASHBOARD" : ""}
            </span>
          </div>
          <div className="font-black text-emerald-400">
            Total Paket Tiba di Cloud: {totalPaketTerkirimCloud} Paket
          </div>
        </div>

        {/* 10 KARTU NODE */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {nodes.map((node) => {
            const sedangPegangPaket = nodeHopAktif === node.nodeId;
            const pernahDilalui = jejakHopSaatIni.includes(node.nodeId);
            const sedangDiedit = nodeTerpilihId === node.nodeId;
            const bateraiKritis = node.teganganVolt < 3.35 || !node.aktif;

            return (
              <div
                key={node.nodeId}
                onClick={() => setNodeTerpilihId(node.nodeId)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between gap-2 ${
                  sedangPegangPaket
                    ? "bg-gradient-to-br from-emerald-900/80 to-teal-950 border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]"
                    : sedangDiedit
                    ? "bg-slate-900 border-sky-400"
                    : bateraiKritis
                    ? "bg-rose-950/40 border-rose-600/70 opacity-75"
                    : pernahDilalui
                    ? "bg-slate-950 border-emerald-500/70"
                    : "bg-slate-950 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      node.nodeId === 10
                        ? "bg-amber-400 text-slate-950"
                        : sedangPegangPaket
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {node.nodeId === 10
                      ? "🌐 NODE 10 (GATEWAY)"
                      : `NODE #${node.nodeId}`}
                  </span>
                  {sedangPegangPaket && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                      TX
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-rose-300 font-bold">
                    <Thermometer className="w-3 h-3 shrink-0" />
                    <span>{node.suhuUdara.toFixed(1)}°C</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-bold ${
                      bateraiKritis ? "text-rose-400" : "text-emerald-300"
                    }`}
                  >
                    <BatteryCharging className="w-3 h-3 shrink-0" />
                    <span>{node.teganganVolt.toFixed(2)}V</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-sky-300 font-bold">
                    <Sprout className="w-3 h-3 shrink-0" />
                    <span>
                      NPK: {node.npkNitrogen}-{node.npkFosfor}-{node.npkKalium}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-slate-400 font-mono text-[9px] truncate">
                    <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>
                      {node.gpsLat.toFixed(4)}, {node.gpsLng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* KALIBRASI NODE TERPILIH & LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-sky-500/40 space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-xs font-black text-sky-300">
                🎛️ Ubah Sensor Node #{nodeTerpilih.nodeId} ({nodeTerpilih.namaBlok}):
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSensorNode(nodeTerpilih.nodeId, {
                      aktif: !nodeTerpilih.aktif,
                    })
                  }
                  className={`px-3 py-1 rounded-lg font-black text-[11px] cursor-pointer ${
                    nodeTerpilih.aktif
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {nodeTerpilih.aktif ? "Daya: ON" : "Daya: MATI"}
                </button>
                <button
                  type="button"
                  onClick={() => kirimPaketUjiDariNodeIni(nodeTerpilih.nodeId)}
                  className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] cursor-pointer"
                >
                  ⚡ Kirim Paket dari Node #{nodeTerpilih.nodeId}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-bold mb-1">
                  <span>🌡️ Suhu:</span>
                  <span className="text-rose-400">
                    {nodeTerpilih.suhuUdara.toFixed(1)} °C
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={45}
                  step={0.1}
                  value={nodeTerpilih.suhuUdara}
                  onChange={(e) =>
                    updateSensorNode(nodeTerpilih.nodeId, {
                      suhuUdara: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-bold mb-1">
                  <span>🔋 Tegangan Baterai:</span>
                  <span className="text-emerald-400">
                    {nodeTerpilih.teganganVolt.toFixed(2)} V (
                    {nodeTerpilih.bateraiPersen}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={4.2}
                  step={0.02}
                  value={nodeTerpilih.teganganVolt}
                  onChange={(e) =>
                    updateSensorNode(nodeTerpilih.nodeId, {
                      teganganVolt: parseFloat(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-bold mb-1">
                  <span>🌱 Pupuk Nitrogen (N):</span>
                  <span className="text-sky-400">
                    {nodeTerpilih.npkNitrogen} mg/kg
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={300}
                  value={nodeTerpilih.npkNitrogen}
                  onChange={(e) =>
                    updateSensorNode(nodeTerpilih.nodeId, {
                      npkNitrogen: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between font-bold mb-1">
                  <span>📍 Batas Peringatan N:</span>
                  <span className="text-amber-300">
                    {batasMinNitrogen} mg/kg
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={batasMinNitrogen}
                  onChange={(e) =>
                    setBatasMinNitrogen(parseInt(e.target.value, 10))
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-black/95 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-black text-amber-300">
              📟 Log Gateway Node #10 ➔ Cloud Dashboard Web:
            </div>
            <div className="font-mono text-[10px] text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
              {logMeshGateway.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABEL DASHBOARD WEB 10 NODE */}
      <div className="bg-white text-slate-900 p-5 rounded-3xl border-2 border-slate-200 shadow-lg space-y-3">
        <div className="font-black text-base text-slate-900">
          🌐 Tabel Dashboard Web Cloud Real-Time (Data dari 10 Node ESP32)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-2.5 rounded-tl-xl">Node</th>
                <th className="p-2.5">Blok Kebun</th>
                <th className="p-2.5">Suhu</th>
                <th className="p-2.5">Pupuk NPK (mg/kg)</th>
                <th className="p-2.5">Tegangan &amp; Baterai</th>
                <th className="p-2.5">GPS (Lat, Lng)</th>
                <th className="p-2.5 rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold">
              {nodes.map((n) => {
                const battLemah = n.teganganVolt < 3.35 || !n.aktif;
                const kurangPupuk = n.npkNitrogen < batasMinNitrogen;
                return (
                  <tr
                    key={n.nodeId}
                    onClick={() => setNodeTerpilihId(n.nodeId)}
                    className={`cursor-pointer ${
                      nodeHopAktif === n.nodeId ? "bg-emerald-50 font-black" : ""
                    }`}
                  >
                    <td className="p-2.5">Node #{n.nodeId}</td>
                    <td className="p-2.5">{n.namaBlok}</td>
                    <td className="p-2.5 text-rose-700">
                      {n.suhuUdara.toFixed(1)}°C
                    </td>
                    <td className="p-2.5 font-mono">
                      N:{n.npkNitrogen} | P:{n.npkFosfor} | K:{n.npkKalium}
                    </td>
                    <td className="p-2.5">
                      {n.teganganVolt.toFixed(2)}V ({n.bateraiPersen}%)
                    </td>
                    <td className="p-2.5 font-mono text-[11px]">
                      {n.gpsLat.toFixed(4)}, {n.gpsLng.toFixed(4)}
                    </td>
                    <td className="p-2.5">
                      {battLemah ? (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px]">
                          LOW BATT
                        </span>
                      ) : kurangPupuk ? (
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px]">
                          PERLU PUPUK NPK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px]">
                          OPTIMAL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};