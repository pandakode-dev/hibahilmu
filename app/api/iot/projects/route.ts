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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = (searchParams.get("userId") || "guest_user").trim();
  const db = muatDatabaseSemuaUser();

  const listUser = db[userId] || [];

  return NextResponse.json({
    ok: true,
    userId,
    total: listUser.length,
    projects: listUser,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "save" | "save_as" | "delete" = body.action || "save";
    const userId: string = (body.userId || "guest_user").trim();
    const db = muatDatabaseSemuaUser();

    if (!db[userId]) {
      db[userId] = [];
    }

    if (action === "save" || action === "save_as") {
      const prj = body.project;
      if (!prj || !prj.idProject) {
        return NextResponse.json(
          { ok: false, message: "Data project tidak lengkap" },
          { status: 400 }
        );
      }

      if (action === "save_as") {
        db[userId] = [prj, ...db[userId]];
      } else {
        const sisa = db[userId].filter(
          (p) =>
            p.idProject !== prj.idProject &&
            (p.namaProject || "").toLowerCase() !==
              (prj.namaProject || "").toLowerCase()
        );
        db[userId] = [prj, ...sisa];
      }

      simpanDatabaseSemuaUser(db);

      return NextResponse.json({
        ok: true,
        message: "Project berhasil disimpan di Server Cloud!",
        projects: db[userId],
      });
    }

    if (action === "delete") {
      const idHapus = body.idProject;
      db[userId] = db[userId].filter((p) => p.idProject !== idHapus);
      simpanDatabaseSemuaUser(db);
      return NextResponse.json({
        ok: true,
        projects: db[userId],
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