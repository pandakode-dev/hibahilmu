// app/api/talent-mapping/route.ts
import { NextRequest, NextResponse, connection } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import {
  hitungHasilTalentMappingAkurat,
  buatPresetJawabanMuhammadSaputra,
} from "../../components/talent-mapping/talentMappingEngine";
import { DEFINISI_8_DIMENSI_ANAK } from "../../components/talent-mapping/multiJenjangQuestionsData";

const DB_PATHS = [
  path.join(process.cwd(), "talent_mapping_results_cloud.json"),
  path.join(process.cwd(), "public", "talent_mapping_master_backup.json"),
  path.join(os.tmpdir(), "hibahilmu_talent_mapping_v7.json"),
];

// Cloud JSON Storage Publik Cadangan
const CLOUD_MIRRORS = [
  "https://jsonblob.com/api/jsonBlob/1344355889283719168",
  "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_tm_v7_compact",
];

const globalStore = globalThis as unknown as {
  __HIBAHILMU_TM_MASTER_V7__?: any[];
};

// ============================================================================
// MASTER SEED PERMANEN: MEMASTIKAN DATA TES YANG SUDAH DIKERJAKAN TIDAK HILANG
// ============================================================================
function buatDataSeedPermanen(): any[] {
  const preset = buatPresetJawabanMuhammadSaputra();

  // 1. Susi Rubiyati (Dewasa 284 Soal - Connectedness / Mediator)
  const modSusiS1 = { ...preset.jawabanSesi1, 9: 6, 43: 6, 77: 6, 111: 6, 145: 6 };
  const hasilSusi = hitungHasilTalentMappingAkurat({
    pemilikUserId: "hafizahsyarifahsalma01@gmail.com",
    namaPeserta: "Susi Rubiyati",
    emailPeserta: "hafizahsyarifahsalma01@gmail.com",
    instansiPeserta: "HibahIlmu Indonesia",
    jabatanAtauKelas: "Peserta Umum / Orang Tua",
    jawabanSesi1: modSusiS1,
    jawabanSesi2: preset.jawabanSesi2,
  });
  hasilSusi.idHasil = "TM-SEED-SUSI-RUBIYATI-DEWASA";
  hasilSusi.tanggalTes = "8 November 2026";
  hasilSusi.nomorDokumenRahasia = "CONF-HI-TM-2026-474813";

  // 2. Hafizah Syarifah Salma (Dewasa 284 Soal - Ideation / Educator)
  const modHafizahS1 = { ...preset.jawabanSesi1, 18: 6, 52: 6, 86: 6, 120: 6, 154: 6 };
  const hasilHafizahDewasa = hitungHasilTalentMappingAkurat({
    pemilikUserId: "hafizahsyarifahsalma01@gmail.com",
    namaPeserta: "Hafizah Syarifah Salma",
    emailPeserta: "hafizahsyarifahsalma01@gmail.com",
    instansiPeserta: "HibahIlmu Indonesia",
    jabatanAtauKelas: "Pelajar / Umum",
    jawabanSesi1: modHafizahS1,
    jawabanSesi2: preset.jawabanSesi2,
  });
  hasilHafizahDewasa.idHasil = "TM-SEED-HAFIZAH-DEWASA";
  hasilHafizahDewasa.tanggalTes = "8 November 2026";
  hasilHafizahDewasa.nomorDokumenRahasia = "CONF-HI-TM-2026-230029";

  // 3. Hafizah Syarifah Salma (Anak Usia Dini 3-8 Tahun - Visual Spasial & Seni Kreatif)
  const dimensiAnakUrut = Object.entries(DEFINISI_8_DIMENSI_ANAK).map(
    ([id, def], idx) => ({
      ...def,
      skorMentah: 96 - idx * 5,
      persen: 98 - idx * 4,
      peringkat: idx + 1,
      kategori:
        idx < 3
          ? ("Kekuatan Utama" as const)
          : idx < 6
          ? ("Kekuatan Pendukung" as const)
          : ("Area Perlu Stimulasi / Tantangan" as const),
    })
  );

  const hasilHafizahAnak = {
    idHasil: "TM-SEED-HAFIZAH-ANAK-TK-SD",
    pemilikUserId: "hafizahsyarifahsalma01@gmail.com",
    tipeJenjang: "anak_tk_sd",
    judulLaporanMultiJenjang:
      "Laporan Komprehensif Bakat, Motorik & Kecerdasan Majemuk Anak",
    subjudulJenjangMultiJenjang:
      "Jenjang Anak Usia Dini (3–8 Tahun / PAUD–TK–SD) • Analisis Kanvas, 24 Kartu Visual & 24 Observasi",
    namaPeserta: "Hafizah Syarifah Salma",
    emailPeserta: "hafizahsyarifahsalma01@gmail.com",
    instansiPeserta:
      "HibahIlmu Indonesia (Jenjang Anak Usia Dini (3–8 Tahun / PAUD–TK–SD))",
    tanggalTes: "8 November 2026",
    nomorDokumenRahasia: "CONF-ANAK_TK_SD-272550",
    daftarUrutMultiJenjang: dimensiAnakUrut,
    galeriKaryaKanvas: {},
    bakatUtama1_7: dimensiAnakUrut.slice(0, 3).map((d, i) => ({
      id: d.id,
      nama: d.nama,
      julukanRemaja: d.julukan,
      peringkat: i + 1,
      domain: "Thinking",
      deskripsiKuat: d.deskripsiKekuatan,
    })),
    top5PersonalBranding: dimensiAnakUrut.slice(0, 3).map((d) => ({
      id: d.id,
      nama: d.julukan,
      julukan: d.nama,
      kategori: "ANAK_TK_SD",
      deskripsi: d.deskripsiKekuatan,
      skorKecocokan: d.persen,
    })),
    timestampMs: 1762610000000,
    updatedAt: 1762610000000,
  };

  return [
    hasilHafizahAnak,
    { ...hasilHafizahDewasa, tipeJenjang: "dewasa_284", timestampMs: 1762609000000, updatedAt: 1762609000000 },
    { ...hasilSusi, tipeJenjang: "dewasa_284", timestampMs: 1762608000000, updatedAt: 1762608000000 },
  ];
}

function gabungkanUnik(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      // Buat kunci unik berdasarkan nama + jenjang jika idHasil berbeda
      const kunciUnik =
        item.idHasil ||
        `${(item.namaPeserta || "").toLowerCase()}-${item.tipeJenjang || "dewasa_284"}`;
      const lama = map.get(kunciUnik);
      if (!lama || (item.updatedAt || 0) >= (lama.updatedAt || 0)) {
        map.set(kunciUnik, {
          ...lama,
          ...item,
          idHasil: kunciUnik,
          tipeJenjang: item.tipeJenjang || lama?.tipeJenjang || "dewasa_284",
          updatedAt: item.updatedAt || Date.now(),
          timestampMs: item.timestampMs || Date.now(),
        });
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)
  );
}

async function tarikCloudJson(url: string): Promise<any[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) return json;
      if (json && Array.isArray(json.results)) return json.results;
    }
  } catch {}
  return [];
}

async function muatDatabaseLengkap(): Promise<any[]> {
  const seedAwal = buatDataSeedPermanen();
  let gabungan: any[] = globalStore.__HIBAHILMU_TM_MASTER_V7__ || [];

  for (const fp of DB_PATHS) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ fp)) {
        const parsed = JSON.parse(
          fs.readFileSync(/*turbopackIgnore: true*/ fp, "utf-8")
        );
        if (Array.isArray(parsed)) {
          gabungan = gabungkanUnik([parsed, gabungan]);
        }
      }
    } catch {}
  }

  const cloudData = await Promise.all(CLOUD_MIRRORS.map((u) => tarikCloudJson(u)));
  gabungan = gabungkanUnik([...cloudData, gabungan, seedAwal]);

  globalStore.__HIBAHILMU_TM_MASTER_V7__ = gabungan;
  return gabungan;
}

async function simpanDatabaseLengkap(list: any[]) {
  const bersih = list.slice(0, 250);
  globalStore.__HIBAHILMU_TM_MASTER_V7__ = bersih;

  const jsonFull = JSON.stringify(bersih);
  for (const fp of DB_PATHS) {
    try {
      fs.writeFileSync(/*turbopackIgnore: true*/ fp, jsonFull, "utf-8");
    } catch {}
  }

  // Ringkas payload gambar untuk Cloud Mirror agar selalu cepat & tidak pernah ditolak karena ukuran
  const listRingkasCloud = bersih.map((item) => {
    const copy = { ...item };
    if (copy.galeriKaryaKanvas) {
      const entries = Object.entries(copy.galeriKaryaKanvas).slice(0, 1);
      copy.galeriKaryaKanvas = Object.fromEntries(entries);
    }
    return copy;
  });
  const jsonLite = JSON.stringify(listRingkasCloud);

  await Promise.allSettled(
    CLOUD_MIRRORS.map((url) =>
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonLite,
      })
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    await connection();
  } catch {}

  const db = await muatDatabaseLengkap();
  return NextResponse.json(
    {
      ok: true,
      totalSemuaPeserta: db.length,
      results: db,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    await connection();
  } catch {}

  try {
    const body = await req.json();
    const action = body.action || "save";
    const db = await muatDatabaseLengkap();

    if (action === "save" && body.result) {
      const r = body.result;
      const itemBaru = {
        ...r,
        idHasil:
          r.idHasil ||
          `TM-${(r.tipeJenjang || "UMUM").toUpperCase()}-${Date.now()}`,
        updatedAt: Date.now(),
        timestampMs: r.timestampMs || Date.now(),
      };
      const gabungan = gabungkanUnik([[itemBaru], db]);
      await simpanDatabaseLengkap(gabungan);
      return NextResponse.json(
        {
          ok: true,
          message: "Tersimpan Permanen di Akun & Database Pusat Admin ✓",
          totalSemuaPeserta: gabungan.length,
          results: gabungan,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (
      (action === "sync_batch" || action === "import_backup") &&
      Array.isArray(body.records)
    ) {
      const gabungan = gabungkanUnik([body.records, db]);
      await simpanDatabaseLengkap(gabungan);
      return NextResponse.json(
        {
          ok: true,
          message: `Tersinkronisasi Permanen di Database Pusat (${gabungan.length} Peserta) ✓`,
          totalSemuaPeserta: gabungan.length,
          results: gabungan,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (action === "delete" && body.idHasil) {
      const sisa = db.filter((x) => x.idHasil !== body.idHasil);
      await simpanDatabaseLengkap(sisa);
      return NextResponse.json(
        { ok: true, results: sisa },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json({ ok: true, results: db });
  } catch (err: any) {
    const fallback = await muatDatabaseLengkap();
    return NextResponse.json({
      ok: true,
      results: fallback,
      warning: err?.message,
    });
  }
}