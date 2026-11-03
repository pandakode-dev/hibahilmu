// app/api/iot/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PROJECTS_PATH = path.join(process.cwd(), "iot_projects_cloud.json");

const globalForProjects = globalThis as unknown as {
  hibahIlmuIotProjectsByUser?: Record<string, any[]>;
};

function muatDatabaseSemuaUser(): Record<string, any[]> {
  if (globalForProjects.hibahIlmuIotProjectsByUser) {
    return globalForProjects.hibahIlmuIotProjectsByUser;
  }
  try {
    if (fs.existsSync(DB_PROJECTS_PATH)) {
      const raw = fs.readFileSync(DB_PROJECTS_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        globalForProjects.hibahIlmuIotProjectsByUser = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback serverless memory
  }
  globalForProjects.hibahIlmuIotProjectsByUser = {};
  return globalForProjects.hibahIlmuIotProjectsByUser;
}

function simpanDatabaseSemuaUser(db: Record<string, any[]>) {
  globalForProjects.hibahIlmuIotProjectsByUser = db;
  try {
    fs.writeFileSync(DB_PROJECTS_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // Fallback read-only environment
  }
}

function gabungkanUnikProjects(lists: any[][]): any[] {
  const map = new Map<string, any>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (item && item.idProject && !map.has(item.idProject)) {
        map.set(item.idProject, item);
      }
    }
  }
  return Array.from(map.values());
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

  // Cari juga di seluruh bucket kalau ada project dengan pemilikId / pemilikNama yang sama
  const semuaSemua: any[] = [];
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
          semuaSemua.push(p);
        }
      });
    }
  });
  kandidatList.push(semuaSemua);

  const hasilGabung = gabungkanUnikProjects(kandidatList);

  return NextResponse.json({
    ok: true,
    userId: email || userId || "guest_user",
    total: hasilGabung.length,
    projects: hasilGabung,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "save" | "save_as" | "delete" = body.action || "save";
    const userId = (body.userId || "guest_user").trim().toLowerCase();
    const email = (body.email || userId).trim().toLowerCase();

    const db = muatDatabaseSemuaUser();
    const keysToSync = Array.from(new Set([userId, email].filter(Boolean)));

    if (action === "save" || action === "save_as") {
      const prj = body.project;
      if (!prj || !prj.idProject) {
        return NextResponse.json(
          { ok: false, message: "Data project tidak lengkap" },
          { status: 400 }
        );
      }

      const prjLengkap = {
        ...prj,
        pemilikId: email || userId,
        pemilikEmail: email,
      };

      for (const k of keysToSync) {
        const listLama = Array.isArray(db[k]) ? db[k] : [];
        if (action === "save_as") {
          db[k] = [prjLengkap, ...listLama];
        } else {
          const sisa = listLama.filter(
            (p) =>
              p.idProject !== prjLengkap.idProject &&
              (p.namaProject || "").toLowerCase() !==
                (prjLengkap.namaProject || "").toLowerCase()
          );
          db[k] = [prjLengkap, ...sisa];
        }
      }

      simpanDatabaseSemuaUser(db);
      const primaryKey = email || userId;

      return NextResponse.json({
        ok: true,
        message: "Project berhasil disimpan ke Server Cloud!",
        projects: db[primaryKey] || [],
      });
    }

    if (action === "delete") {
      const idHapus = body.idProject;
      for (const k of keysToSync) {
        if (Array.isArray(db[k])) {
          db[k] = db[k].filter((p) => p.idProject !== idHapus);
        }
      }
      simpanDatabaseSemuaUser(db);
      const primaryKey = email || userId;
      return NextResponse.json({
        ok: true,
        projects: db[primaryKey] || [],
      });
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