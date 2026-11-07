// app/api/talent-mapping/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DB_LOCAL_PATH = path.join(process.cwd(), "talent_mapping_results_cloud.json");
const DB_BACKUP_PATH = path.join(process.cwd(), "public", "talent_mapping_master_backup.json");
const DB_TMP_PATH = path.join(os.tmpdir(), "hibahilmu_talent_mapping_cloud.json");

// Dua Bucket Cloud Redundan agar Data Permanen & Tidak Pernah Hilang
const KV_PRIMARY_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_tm_master_v3";
const KV_MIRROR_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_talent_mapping_v2";

const globalForTm = globalThis as unknown as {
  hibahIlmuTalentMappingMasterDb?: any[];
};

function gabungkanHasilUnikTerbaru(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || !item.idHasil) continue;
      const existing = map.get(item.idHasil);
      if (!existing || (item.updatedAt || 0) >= (existing.updatedAt || 0)) {
        map.set(item.idHasil, item);
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
    const timer = setTimeout(() => controller.abort(), 2800);
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

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_TMP_PATH)) {
      const parsed = JSON.parse(
        fs.readFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, "utf-8")
      );
      if (Array.isArray(parsed)) gabungan = gabungkanHasilUnikTerbaru([parsed, gabungan]);
    }
  } catch {}

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH)) {
      const parsed = JSON.parse(
        fs.readFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, "utf-8")
      );
      if (Array.isArray(parsed)) gabungan = gabungkanHasilUnikTerbaru([parsed, gabungan]);
    }
  } catch {}

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_BACKUP_PATH)) {
      const parsed = JSON.parse(
        fs.readFileSync(/*turbopackIgnore: true*/ DB_BACKUP_PATH, "utf-8")
      );
      if (Array.isArray(parsed)) gabungan = gabungkanHasilUnikTerbaru([parsed, gabungan]);
    }
  } catch {}

  const [cloudPrimary, cloudMirror] = await Promise.all([
    tarikDariCloudBucket(KV_PRIMARY_URL),
    tarikDariCloudBucket(KV_MIRROR_URL),
  ]);

  gabungan = gabungkanHasilUnikTerbaru([cloudPrimary, cloudMirror, gabungan]);
  globalForTm.hibahIlmuTalentMappingMasterDb = gabungan;
  return gabungan;
}

async function simpanKeDatabasePusatPermanen(list: any[]) {
  const daftarBersih = list.slice(0, 500);
  globalForTm.hibahIlmuTalentMappingMasterDb = daftarBersih;
  const jsonStr = JSON.stringify(daftarBersih, null, 2);

  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, jsonStr, "utf-8");
  } catch {}
  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, jsonStr, "utf-8");
  } catch {}
  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_BACKUP_PATH, jsonStr, "utf-8");
  } catch {}

  await Promise.allSettled([
    fetch(KV_PRIMARY_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonStr,
    }),
    fetch(KV_MIRROR_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonStr,
    }),
  ]);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const role = (searchParams.get("role") || "").trim().toLowerCase();
  const mode = (searchParams.get("mode") || "").trim().toLowerCase();

  const db = await muatDatabasePusatTalentMapping();

  // Jika Admin, Guru, HRBP, atau mode="all", kembalikan 100% seluruh data peserta dari semua jenjang
  if (role === "admin" || role === "guru" || mode === "all" || !email) {
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
      (r.namaPeserta || "").toLowerCase().includes(email)
  );

  return NextResponse.json(
    {
      ok: true,
      totalSemuaPeserta: db.length,
      results: milikPeserta.length > 0 ? milikPeserta : db,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "save";
    const db = await muatDatabasePusatTalentMapping();

    if (action === "save" && body.result) {
      const recordBaru = {
        ...body.result,
        timestampMs: body.result.timestampMs || Date.now(),
        updatedAt: Date.now(),
      };
      const gabungan = gabungkanHasilUnikTerbaru([[recordBaru], db]);
      await simpanKeDatabasePusatPermanen(gabungan);
      return NextResponse.json(
        {
          ok: true,
          message: "Tersimpan Permanen di Database Pusat HibahIlmu (Multi-Cloud Mirror)!",
          totalSemuaPeserta: gabungan.length,
          results: gabungan,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (action === "import_backup" && Array.isArray(body.records)) {
      const gabungan = gabungkanHasilUnikTerbaru([body.records, db]);
      await simpanKeDatabasePusatPermanen(gabungan);
      return NextResponse.json(
        {
          ok: true,
          message: `Berhasil memulihkan & menggabungkan ${gabungan.length} data peserta!`,
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
      { ok: false, message: "Action tidak dikenali" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Payload JSON tidak valid" },
      { status: 400 }
    );
  }
}