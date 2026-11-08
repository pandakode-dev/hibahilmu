// app/api/talent-mapping/route.ts
import { NextRequest, NextResponse, connection } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DB_PATHS = [
  path.join(process.cwd(), "talent_mapping_results_cloud.json"),
  path.join(process.cwd(), "public", "talent_mapping_master_backup.json"),
  path.join(os.tmpdir(), "hibahilmu_talent_mapping_v8.json"),
];

const DELETED_TOMBSTONE_PATHS = [
  path.join(process.cwd(), "talent_mapping_deleted_ids.json"),
  path.join(os.tmpdir(), "hibahilmu_tm_deleted_v8.json"),
];

const CLOUD_MIRRORS = [
  "https://jsonblob.com/api/jsonBlob/1344355889283719168",
  "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_tm_v8_clean",
];

const globalStore = globalThis as unknown as {
  __HIBAHILMU_TM_CLEAN_V8__?: any[];
  __HIBAHILMU_TM_DELETED_IDS__?: Set<string>;
};

const SUPER_ADMIN_EMAILS = new Set([
  "saputra@pcr.ac.id",
  "msaputrap1234@gmail.com",
  "admin@hibahilmu.id",
]);

function apakahSuperAdmin(email?: string | null, role?: string | null): boolean {
  const e = (email || "").trim().toLowerCase();
  const r = (role || "").trim().toLowerCase();
  return r === "admin" || SUPER_ADMIN_EMAILS.has(e);
}

// Kunci sidik jari unik agar data yang sama tidak pernah ganda/duplikat
function buatKunciDeduplikasi(item: any): string {
  const noDok = String(item?.nomorDokumenRahasia || "").trim().toUpperCase();
  const nama = String(item?.namaPeserta || "").trim().toLowerCase();
  const email = String(item?.emailPeserta || "").trim().toLowerCase();
  const jenjang = String(item?.tipeJenjang || "dewasa_284").trim().toLowerCase();

  if (noDok && nama) {
    return `${nama}::${jenjang}::${noDok}`;
  }
  return item?.idHasil || `${email}::${nama}::${jenjang}`;
}

function muatDaftarDeletedIds(): Set<string> {
  const set = globalStore.__HIBAHILMU_TM_DELETED_IDS__ || new Set<string>();
  for (const fp of DELETED_TOMBSTONE_PATHS) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ fp)) {
        const arr = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ fp, "utf-8"));
        if (Array.isArray(arr)) arr.forEach((id) => set.add(String(id)));
      }
    } catch {}
  }
  globalStore.__HIBAHILMU_TM_DELETED_IDS__ = set;
  return set;
}

function simpanDaftarDeletedIds(set: Set<string>) {
  globalStore.__HIBAHILMU_TM_DELETED_IDS__ = set;
  const json = JSON.stringify(Array.from(set));
  for (const fp of DELETED_TOMBSTONE_PATHS) {
    try {
      fs.writeFileSync(/*turbopackIgnore: true*/ fp, json, "utf-8");
    } catch {}
  }
}

function gabungkanDanBersihkanDuplikat(
  lists: any[][],
  deletedSet: Set<string>
): any[] {
  const mapById = new Map<string, any>();
  const mapByFingerprint = new Map<string, string>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const raw of list) {
      if (!raw || typeof raw !== "object") continue;
      const id = String(raw.idHasil || "").trim();
      if (!id) continue;

      const fpKey = buatKunciDeduplikasi(raw);
      if (
        deletedSet.has(id) ||
        deletedSet.has(fpKey) ||
        id.startsWith("TM-SEED-")
      ) {
        continue;
      }

      const idSudahAdaUntukFingerprintIni = mapByFingerprint.get(fpKey);
      const targetId = idSudahAdaUntukFingerprintIni || id;

      const existing = mapById.get(targetId);
      if (!existing || (raw.updatedAt || 0) >= (existing.updatedAt || 0)) {
        mapById.set(targetId, {
          ...existing,
          ...raw,
          idHasil: targetId,
          emailPeserta: String(raw.emailPeserta || existing?.emailPeserta || "")
            .trim()
            .toLowerCase(),
          tipeJenjang: raw.tipeJenjang || existing?.tipeJenjang || "dewasa_284",
          updatedAt: Number(raw.updatedAt) || Date.now(),
          timestampMs: Number(raw.timestampMs) || Date.now(),
        });
        mapByFingerprint.set(fpKey, targetId);
      }
    }
  }

  return Array.from(mapById.values()).sort(
    (a, b) => (b.timestampMs || 0) - (a.timestampMs || 0)
  );
}

async function tarikCloudPayload(url: string): Promise<{
  records: any[];
  deletedIds: string[];
}> {
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
      if (Array.isArray(json)) {
        return { records: json, deletedIds: [] };
      }
      if (json && typeof json === "object") {
        return {
          records: Array.isArray(json.records)
            ? json.records
            : Array.isArray(json.results)
            ? json.results
            : [],
          deletedIds: Array.isArray(json.deletedIds) ? json.deletedIds : [],
        };
      }
    }
  } catch {}
  return { records: [], deletedIds: [] };
}

async function muatDatabaseMaster(): Promise<any[]> {
  const deletedSet = muatDaftarDeletedIds();
  let gabungan: any[] = globalStore.__HIBAHILMU_TM_CLEAN_V8__ || [];

  for (const fp of DB_PATHS) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ fp)) {
        const parsed = JSON.parse(
          fs.readFileSync(/*turbopackIgnore: true*/ fp, "utf-8")
        );
        if (Array.isArray(parsed)) {
          gabungan = gabungkanDanBersihkanDuplikat([parsed, gabungan], deletedSet);
        }
      }
    } catch {}
  }

  const cloudPayloads = await Promise.all(
    CLOUD_MIRRORS.map((u) => tarikCloudPayload(u))
  );
  for (const cp of cloudPayloads) {
    cp.deletedIds.forEach((id) => deletedSet.add(String(id)));
  }
  simpanDaftarDeletedIds(deletedSet);

  gabungan = gabungkanDanBersihkanDuplikat(
    [...cloudPayloads.map((c) => c.records), gabungan],
    deletedSet
  );

  globalStore.__HIBAHILMU_TM_CLEAN_V8__ = gabungan;
  return gabungan;
}

async function simpanDatabaseMaster(list: any[]) {
  const deletedSet = muatDaftarDeletedIds();
  const bersih = gabungkanDanBersihkanDuplikat([list], deletedSet).slice(0, 250);
  globalStore.__HIBAHILMU_TM_CLEAN_V8__ = bersih;

  const jsonLocal = JSON.stringify(bersih, null, 2);
  for (const fp of DB_PATHS) {
    try {
      fs.writeFileSync(/*turbopackIgnore: true*/ fp, jsonLocal, "utf-8");
    } catch {}
  }

  const payloadCloud = JSON.stringify({
    updatedAt: Date.now(),
    deletedIds: Array.from(deletedSet),
    records: bersih.map((item) => {
      const copy = { ...item };
      if (copy.galeriKaryaKanvas) {
        const entries = Object.entries(copy.galeriKaryaKanvas).slice(0, 1);
        copy.galeriKaryaKanvas = Object.fromEntries(entries);
      }
      return copy;
    }),
  });

  await Promise.allSettled(
    CLOUD_MIRRORS.map((url) =>
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payloadCloud,
      })
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    await connection();
  } catch {}

  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const role = (searchParams.get("role") || "").trim().toLowerCase();

  const db = await muatDatabaseMaster();

  if (apakahSuperAdmin(email, role)) {
    return NextResponse.json(
      {
        ok: true,
        isSuperAdmin: true,
        totalSemuaPeserta: db.length,
        results: db,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  if (!email) {
    return NextResponse.json(
      {
        ok: true,
        isSuperAdmin: false,
        totalSemuaPeserta: 0,
        results: [],
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const milikSendiri = db.filter(
    (r) =>
      String(r.emailPeserta || "").trim().toLowerCase() === email ||
      String(r.pemilikUserId || "").trim().toLowerCase() === email
  );

  return NextResponse.json(
    {
      ok: true,
      isSuperAdmin: false,
      totalSemuaPeserta: milikSendiri.length,
      results: milikSendiri,
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
    const reqEmail = (body.email || body.result?.emailPeserta || "")
      .trim()
      .toLowerCase();
    const reqRole = (body.role || "").trim().toLowerCase();

    const deletedSet = muatDaftarDeletedIds();
    const db = await muatDatabaseMaster();

    if (action === "save" && body.result) {
      const r = body.result;
      const idBaru =
        r.idHasil ||
        `TM-${(r.tipeJenjang || "UMUM").toUpperCase()}-${Date.now()}`;
      const fpKey = buatKunciDeduplikasi(r);

      deletedSet.delete(idBaru);
      deletedSet.delete(fpKey);
      simpanDaftarDeletedIds(deletedSet);

      const itemBaru = {
        ...r,
        idHasil: idBaru,
        emailPeserta: String(r.emailPeserta || reqEmail || "peserta@hibahilmu.id")
          .trim()
          .toLowerCase(),
        updatedAt: Date.now(),
        timestampMs: r.timestampMs || Date.now(),
      };

      const gabungan = gabungkanDanBersihkanDuplikat([[itemBaru], db], deletedSet);
      await simpanDatabaseMaster(gabungan);

      const hasilKembali = apakahSuperAdmin(reqEmail, reqRole)
        ? gabungan
        : gabungan.filter(
            (x) => String(x.emailPeserta || "").toLowerCase() === itemBaru.emailPeserta
          );

      return NextResponse.json(
        {
          ok: true,
          message: "Tersimpan Permanen di Akun & Database Pusat ✓",
          results: hasilKembali,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (action === "delete" && body.idHasil) {
      const targetId = String(body.idHasil).trim();
      deletedSet.add(targetId);

      const targetObj = db.find((x) => x.idHasil === targetId);
      if (targetObj) {
        deletedSet.add(buatKunciDeduplikasi(targetObj));
      }
      if (body.nomorDokumenRahasia && body.namaPeserta) {
        deletedSet.add(buatKunciDeduplikasi(body));
      }
      simpanDaftarDeletedIds(deletedSet);

      const sisa = db.filter(
        (x) =>
          x.idHasil !== targetId &&
          !deletedSet.has(buatKunciDeduplikasi(x))
      );
      await simpanDatabaseMaster(sisa);

      const hasilKembali = apakahSuperAdmin(reqEmail, reqRole)
        ? sisa
        : sisa.filter((x) => String(x.emailPeserta || "").toLowerCase() === reqEmail);

      return NextResponse.json(
        {
          ok: true,
          message: "Data hasil tes berhasil dihapus permanen!",
          results: hasilKembali,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    if (
      (action === "sync_batch" || action === "import_backup") &&
      Array.isArray(body.records)
    ) {
      const gabungan = gabungkanDanBersihkanDuplikat(
        [body.records, db],
        deletedSet
      );
      await simpanDatabaseMaster(gabungan);

      const hasilKembali = apakahSuperAdmin(reqEmail, reqRole)
        ? gabungan
        : gabungan.filter(
            (x) => String(x.emailPeserta || "").toLowerCase() === reqEmail
          );

      return NextResponse.json(
        {
          ok: true,
          results: hasilKembali,
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    return NextResponse.json({ ok: true, results: db });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, results: [], message: err?.message },
      { status: 500 }
    );
  }
}