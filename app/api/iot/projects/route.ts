// app/api/iot/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Gunakan baik direktori kerja lokal maupun /tmp (satu-satunya folder writable di Vercel Serverless)
const DB_LOCAL_PATH = path.join(process.cwd(), "iot_projects_cloud.json");
const DB_TMP_PATH = path.join(os.tmpdir(), "hibahilmu_iot_projects_cloud.json");
const PUBLIC_GLOBAL_KEY = "__public_global_projects__";

const globalForProjects = globalThis as unknown as {
  hibahIlmuIotProjectsByUser?: Record<string, any[]>;
};

function gabungkanSemuaProjectUnik(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || !item.namaProject) continue;
      const kunciUnik = `${(item.namaProject || "").trim().toLowerCase()}__${
        item.mode || "wokwi"
      }`;
      if (!map.has(kunciUnik)) {
        map.set(kunciUnik, item);
      }
    }
  }
  return Array.from(map.values());
}

function muatDatabaseSemuaUser(): Record<string, any[]> {
  const hasilGabung: Record<string, any[]> =
    globalForProjects.hibahIlmuIotProjectsByUser || {};

  for (const filePath of [DB_TMP_PATH, DB_LOCAL_PATH]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          for (const [k, arr] of Object.entries(parsed)) {
            if (Array.isArray(arr)) {
              hasilGabung[k] = gabungkanSemuaProjectUnik([
                hasilGabung[k] || [],
                arr,
              ]);
            }
          }
        }
      }
    } catch {}
  }

  globalForProjects.hibahIlmuIotProjectsByUser = hasilGabung;
  return hasilGabung;
}

function simpanDatabaseSemuaUser(db: Record<string, any[]>) {
  globalForProjects.hibahIlmuIotProjectsByUser = db;
  const jsonStr = JSON.stringify(db, null, 2);
  try {
    fs.writeFileSync(DB_TMP_PATH, jsonStr, "utf-8");
  } catch {}
  try {
    fs.writeFileSync(DB_LOCAL_PATH, jsonStr, "utf-8");
  } catch {}
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = (searchParams.get("userId") || "").trim().toLowerCase();
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const nama = (searchParams.get("nama") || "").trim().toLowerCase();

  const db = muatDatabaseSemuaUser();

  const kandidatList: any[][] = [];
  if (email && db[email]) kandidatList.push(db[email]);
  if (userId && db[userId]) kandidatList.push(db[userId]);
  if (db[PUBLIC_GLOBAL_KEY]) kandidatList.push(db[PUBLIC_GLOBAL_KEY]);

  const semuaCocok: any[] = [];
  Object.values(db).forEach((arr) => {
    if (Array.isArray(arr)) {
      arr.forEach((p) => {
        const pid = (p?.pemilikId || "").toLowerCase();
        const pmail = (p?.pemilikEmail || "").toLowerCase();
        const pnama = (p?.pemilikNama || "").toLowerCase();
        if (
          (email && (pid === email || pmail === email)) ||
          (userId && pid === userId) ||
          (nama && nama !== "tamu (guest)" && pnama === nama)
        ) {
          semuaCocok.push(p);
        }
      });
    }
  });
  kandidatList.unshift(semuaCocok);

  const hasilGabung = gabungkanSemuaProjectUnik(kandidatList);

  return NextResponse.json(
    {
      ok: true,
      userId: email || userId || "public",
      total: hasilGabung.length,
      projects: hasilGabung,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "save" | "save_as" | "delete" | "sync_bulk" =
      body.action || "save";
    const userId = (body.userId || "guest_user").trim().toLowerCase();
    const email = (body.email || userId).trim().toLowerCase();

    const db = muatDatabaseSemuaUser();
    const keysToSync = Array.from(
      new Set([userId, email, PUBLIC_GLOBAL_KEY].filter(Boolean))
    );

    if (action === "sync_bulk" && Array.isArray(body.projects)) {
      for (const k of keysToSync) {
        const listLama = Array.isArray(db[k]) ? db[k] : [];
        db[k] = gabungkanSemuaProjectUnik([body.projects, listLama]);
      }
      simpanDatabaseSemuaUser(db);
      const primaryKey = email || userId || PUBLIC_GLOBAL_KEY;
      return NextResponse.json(
        {
          ok: true,
          message: "Seluruh project berhasil disinkronkan ke Server Publik!",
          projects: db[primaryKey] || [],
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (action === "save" || action === "save_as") {
      const prj = body.project;
      if (!prj || !prj.namaProject) {
        return NextResponse.json(
          { ok: false, message: "Data project tidak lengkap" },
          { status: 400 }
        );
      }

      const namaBersih = (prj.namaProject || "Project IoT").trim();
      const slugNama = namaBersih.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const idUnikBerdasarkanNama =
        action === "save_as"
          ? `prj-${slugNama}-${Date.now()}`
          : `prj-${slugNama}-${prj.mode || "wokwi"}`;

      const prjLengkap = {
        ...prj,
        idProject: idUnikBerdasarkanNama,
        namaProject: namaBersih,
        pemilikId: email || userId,
        pemilikEmail: email,
      };

      for (const k of keysToSync) {
        const listLama = Array.isArray(db[k]) ? db[k] : [];
        const sisa = listLama.filter(
          (p) =>
            (p.namaProject || "").trim().toLowerCase() !==
            namaBersih.toLowerCase()
        );
        db[k] = [prjLengkap, ...sisa];
      }

      simpanDatabaseSemuaUser(db);
      const primaryKey = email || userId || PUBLIC_GLOBAL_KEY;

      return NextResponse.json(
        {
          ok: true,
          message: "Project berhasil disimpan ke Database Publik Server!",
          project: prjLengkap,
          projects: db[primaryKey] || [],
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (action === "delete") {
      const idHapus = body.idProject;
      const namaHapus = (body.namaProject || "").trim().toLowerCase();
      for (const k of keysToSync) {
        if (Array.isArray(db[k])) {
          db[k] = db[k].filter(
            (p) =>
              p.idProject !== idHapus &&
              (!namaHapus ||
                (p.namaProject || "").trim().toLowerCase() !== namaHapus)
          );
        }
      }
      simpanDatabaseSemuaUser(db);
      const primaryKey = email || userId || PUBLIC_GLOBAL_KEY;
      return NextResponse.json(
        {
          ok: true,
          projects: db[primaryKey] || [],
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Action tidak dikenali" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format JSON tidak valid" },
      { status: 400 }
    );
  }
}