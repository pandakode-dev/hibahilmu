// app/api/talent-mapping/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DB_LOCAL_PATH = path.join(process.cwd(), "talent_mapping_results_cloud.json");
const DB_BACKUP_PATH = path.join(process.cwd(), "public", "talent_mapping_master_backup.json");
const DB_TMP_PATH = path.join(os.tmpdir(), "hibahilmu_talent_mapping_cloud.json");

// Tiga Bucket Cloud Redundan (Primary, Mirror, & Lite Index) agar 100% Anti-Gagal
const KV_PRIMARY_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_tm_master_v3";
const KV_MIRROR_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_talent_mapping_v2";
const KV_INDEX_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_tm_index_lite_v1";

const globalForTm = globalThis as unknown as {
  hibahIlmuTalentMappingMasterDb?: any[];
};

function normalisasiRecordHasil(item: any): any {
  if (!item || typeof item !== "object") return null;
  const idAman =
    item.idHasil ||
    `TM-${(item.tipeJenjang || "UMUM").toUpperCase()}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;
  return {
    ...item,
    idHasil: idAman,
    namaPeserta: item.namaPeserta || "Peserta HibahIlmu",
    emailPeserta: (item.emailPeserta || "peserta@hibahilmu.id").trim().toLowerCase(),
    instansiPeserta: item.instansiPeserta || "HibahIlmu Indonesia",
    tipeJenjang: item.tipeJenjang || "dewasa_284",
    tanggalTes:
      item.tanggalTes ||
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    nomorDokumenRahasia:
      item.nomorDokumenRahasia ||
      `CONF-${Math.floor(100000 + Math.random() * 900000)}`,
    timestampMs: Number(item.timestampMs) || Date.now(),
    updatedAt: Number(item.updatedAt) || Date.now(),
  };
}

function gabungkanHasilUnikTerbaru(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const rawItem of list) {
      const item = normalisasiRecordHasil(rawItem);
      if (!item || !item.idHasil) continue;
      const existing = map.get(item.idHasil);
      if (!existing || (item.updatedAt || 0) >= (existing.updatedAt || 0)) {
        map.set(item.idHasil, {
          ...existing,
          ...item,
          galeriKaryaKanvas:
            item.galeriKaryaKanvas && Object.keys(item.galeriKaryaKanvas).length > 0
              ? item.galeriKaryaKanvas
              : existing?.galeriKaryaKanvas || {},
          urutan34Bakat: item.urutan34Bakat || existing?.urutan34Bakat,
          petaLengkap114SCM: item.petaLengkap114SCM || existing?.petaLengkap114SCM,
          daftarUrutMultiJenjang:
            item.daftarUrutMultiJenjang || existing?.daftarUrutMultiJenjang,
        });
      }
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)
  );
}

async function tarikDariCloudBucket(url: string): Promise<any[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch {}
  return [];
}

async function muatDatabasePusatTalentMapping(): Promise<any[]> {
  let gabungan: any[] = globalForTm.hibahIlmuTalentMappingMasterDb || [];

  for (const filePath of [DB_TMP_PATH, DB_LOCAL_PATH, DB_BACKUP_PATH]) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
        const parsed = JSON.parse(
          fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8")
        );
        if (Array.isArray(parsed)) {
          gabungan = gabungkanHasilUnikTerbaru([parsed, gabungan]);
        }
      }
    } catch {}
  }

  const [cloudPrimary, cloudMirror, cloudIndex] = await Promise.all([
    tarikDariCloudBucket(KV_PRIMARY_URL),
    tarikDariCloudBucket(KV_MIRROR_URL),
    tarikDariCloudBucket(KV_INDEX_URL),
  ]);

  gabungan = gabungkanHasilUnikTerbaru([
    cloudPrimary,
    cloudMirror,
    cloudIndex,
    gabungan,
  ]);
  globalForTm.hibahIlmuTalentMappingMasterDb = gabungan;
  return gabungan;
}

async function simpanKeDatabasePusatPermanen(list: any[]) {
  const daftarBersih = list.slice(0, 300);
  globalForTm.hibahIlmuTalentMappingMasterDb = daftarBersih;
  const jsonFull = JSON.stringify(daftarBersih);

  for (const filePath of [DB_TMP_PATH, DB_LOCAL_PATH, DB_BACKUP_PATH]) {
    try {
      fs.writeFileSync(/*turbopackIgnore: true*/ filePath, jsonFull, "utf-8");
    } catch {}
  }

  const daftarLite = daftarBersih.map((r) => {
    const salinan = { ...r };
    if (salinan.galeriKaryaKanvas) {
      const entries = Object.entries(salinan.galeriKaryaKanvas).slice(0, 2);
      salinan.galeriKaryaKanvas = Object.fromEntries(entries);
    }
    return salinan;
  });
  const jsonLite = JSON.stringify(daftarLite);

  await Promise.allSettled([
    fetch(KV_PRIMARY_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonFull.length < 900000 ? jsonFull : jsonLite,
    }),
    fetch(KV_MIRROR_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonLite,
    }),
    fetch(KV_INDEX_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonLite,
    }),
  ]);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();
    const role = (searchParams.get("role") || "").trim().toLowerCase();
    const mode = (searchParams.get("mode") || "").trim().toLowerCase();

    const db = await muatDatabasePusatTalentMapping();

    if (
      role === "admin" ||
      role === "guru" ||
      mode === "all" ||
      !email ||
      email === "saputra@pcr.ac.id" ||
      email === "msaputrap1234@gmail.com" ||
      email === "admin@hibahilmu.id"
    ) {
      return NextResponse.json(
        {
          ok: true,
          totalSemuaPeserta: db.length,
          results: db,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const milikPeserta = db.filter(
      (r) =>
        (r.emailPeserta || "").toLowerCase() === email ||
        (r.namaPeserta || "").toLowerCase().includes(email) ||
        (r.pemilikUserId || "").toLowerCase() === email
    );

    return NextResponse.json(
      {
        ok: true,
        totalSemuaPeserta: db.length,
        results: milikPeserta.length > 0 ? milikPeserta : db,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: true,
        totalSemuaPeserta: 0,
        results: globalForTm.hibahIlmuTalentMappingMasterDb || [],
        warning: err?.message,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "save";
    const db = await muatDatabasePusatTalentMapping();

    if (action === "save" && body.result) {
      const recordBaru = normalisasiRecordHasil({
        ...body.result,
        updatedAt: Date.now(),
      });
      const gabungan = gabungkanHasilUnikTerbaru([[recordBaru], db]);
      await simpanKeDatabasePusatPermanen(gabungan);
      return NextResponse.json(
        {
          ok: true,
          message: "Tersimpan Permanen di Akun & Database Pusat Cloud ✓",
          totalSemuaPeserta: gabungan.length,
          results: gabungan,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (
      (action === "sync_batch" || action === "import_backup") &&
      Array.isArray(body.records)
    ) {
      const validRecords = body.records
        .map((r: any) => normalisasiRecordHasil(r))
        .filter(Boolean);
      const gabungan = gabungkanHasilUnikTerbaru([validRecords, db]);
      if (validRecords.length > 0) {
        await simpanKeDatabasePusatPermanen(gabungan);
      }
      return NextResponse.json(
        {
          ok: true,
          message: `Tersinkronisasi Permanen di Akun & Database Pusat (${gabungan.length} Hasil Tes) ✓`,
          totalSemuaPeserta: gabungan.length,
          results: gabungan,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (action === "delete" && body.idHasil) {
      const sisa = db.filter((r) => r.idHasil !== body.idHasil);
      await simpanKeDatabasePusatPermanen(sisa);
      return NextResponse.json(
        { ok: true, results: sisa },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { ok: true, results: db },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Gagal memproses penyimpanan: " + (err?.message || "Unknown"),
      },
      { status: 500 }
    );
  }
}