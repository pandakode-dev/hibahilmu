// app/api/talent-mapping/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DB_LOCAL_PATH = path.join(process.cwd(), "talent_mapping_results_cloud.json");
const DB_TMP_PATH = path.join(os.tmpdir(), "hibahilmu_talent_mapping_cloud.json");
const KV_TM_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_talent_mapping_v2";

const globalForTm = globalThis as unknown as {
  hibahIlmuTalentMappingDb?: any[];
};

function gabungkanHasilUnik(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || !item.idHasil) continue;
      if (!map.has(item.idHasil)) {
        map.set(item.idHasil, item);
      }
    }
  }
  return Array.from(map.values());
}

async function muatDatabaseTalentMapping(): Promise<any[]> {
  let gabungan: any[] = globalForTm.hibahIlmuTalentMappingDb || [];

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_TMP_PATH)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) gabungan = gabungkanHasilUnik([parsed, gabungan]);
    }
  } catch {}

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) gabungan = gabungkanHasilUnik([parsed, gabungan]);
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2200);
    const res = await fetch(KV_TM_URL, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const cloud = await res.json();
      if (Array.isArray(cloud)) gabungan = gabungkanHasilUnik([cloud, gabungan]);
    }
  } catch {}

  globalForTm.hibahIlmuTalentMappingDb = gabungan;
  return gabungan;
}

async function simpanDatabaseTalentMapping(list: any[]) {
  globalForTm.hibahIlmuTalentMappingDb = list;
  const jsonStr = JSON.stringify(list, null, 2);

  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, jsonStr, "utf-8");
  } catch {}
  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, jsonStr, "utf-8");
  } catch {}

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2200);
    await fetch(KV_TM_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonStr,
      signal: controller.signal,
    });
    clearTimeout(timer);
  } catch {}
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const role = (searchParams.get("role") || "").trim().toLowerCase();

  const db = await muatDatabaseTalentMapping();

  // Jika Admin / Guru / HRBP, tampilkan seluruh hasil asesmen peserta; jika siswa, prioritaskan miliknya
  const hasilFilter =
    role === "admin" || role === "guru" || !email
      ? db
      : db.filter(
          (r) =>
            (r.emailPeserta || "").toLowerCase() === email ||
            (r.namaPeserta || "").toLowerCase().includes(email)
        );

  return NextResponse.json(
    {
      ok: true,
      total: hasilFilter.length,
      results: hasilFilter.length > 0 ? hasilFilter : db,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "save";
    const db = await muatDatabaseTalentMapping();

    if (action === "save" && body.result) {
      const baru = gabungkanHasilUnik([[body.result], db]).slice(0, 100);
      await simpanDatabaseTalentMapping(baru);
      return NextResponse.json(
        {
          ok: true,
          message: "Laporan Rahasia Talent Mapping tersimpan di Cloud Server!",
          results: baru,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (action === "delete" && body.idHasil) {
      const sisa = db.filter((r) => r.idHasil !== body.idHasil);
      await simpanDatabaseTalentMapping(sisa);
      return NextResponse.json(
        { ok: true, results: sisa },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Action tidak valid" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format JSON tidak valid" },
      { status: 400 }
    );
  }
}