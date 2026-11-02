// app/api/iot/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PROJECTS_PATH = path.join(process.cwd(), "iot_projects_cloud.json");

export interface CloudIotProjectItem {
  id: string;
  ownerEmail: string;
  ownerName: string;
  namaProject: string;
  updatedAt: string;
  rooms: any[];
  nodes: any[];
  wires: any[];
  sourceCode: string;
  bahasa: string;
}

const globalForProjects = globalThis as unknown as {
  hibahIlmuIotProjectsDb?: CloudIotProjectItem[];
};

function muatDatabaseProject(): CloudIotProjectItem[] {
  if (globalForProjects.hibahIlmuIotProjectsDb) {
    return globalForProjects.hibahIlmuIotProjectsDb;
  }
  try {
    if (fs.existsSync(DB_PROJECTS_PATH)) {
      const raw = fs.readFileSync(DB_PROJECTS_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        globalForProjects.hibahIlmuIotProjectsDb = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback serverless memory
  }
  globalForProjects.hibahIlmuIotProjectsDb = [];
  return globalForProjects.hibahIlmuIotProjectsDb;
}

function simpanDatabaseProject(list: CloudIotProjectItem[]) {
  globalForProjects.hibahIlmuIotProjectsDb = list;
  try {
    fs.writeFileSync(DB_PROJECTS_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // Fallback read-only environment
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();
  const db = muatDatabaseProject();

  const daftarMilikUser = email
    ? db.filter((p) => p.ownerEmail.toLowerCase() === email || p.ownerEmail === "public")
    : db;

  return NextResponse.json({
    ok: true,
    total: daftarMilikUser.length,
    projects: daftarMilikUser,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "save";
    const db = muatDatabaseProject();

    if (action === "save") {
      const ownerEmail = (body.ownerEmail || "public").trim().toLowerCase();
      const projectBaru: CloudIotProjectItem = {
        id: body.id || `prj-${Date.now()}`,
        ownerEmail,
        ownerName: body.ownerName || "Maker HibahIlmu",
        namaProject: body.namaProject || "Rangkaian IoT Tanpa Judul",
        updatedAt: new Date().toLocaleString("id-ID"),
        rooms: body.rooms || [],
        nodes: body.nodes || [],
        wires: body.wires || [],
        sourceCode: body.sourceCode || "",
        bahasa: body.bahasa || "iot_esp32",
      };

      const idxLama = db.findIndex((p) => p.id === projectBaru.id);
      if (idxLama >= 0) {
        db[idxLama] = projectBaru;
      } else {
        db.unshift(projectBaru);
      }

      simpanDatabaseProject(db);

      return NextResponse.json({
        ok: true,
        message: "Project berhasil disimpan ke Server Cloud! Bisa dibuka di PC/HP mana saja.",
        project: projectBaru,
        projects: db.filter((p) => p.ownerEmail.toLowerCase() === ownerEmail || p.ownerEmail === "public"),
      });
    }

    if (action === "delete") {
      const targetId = body.id;
      const baru = db.filter((p) => p.id !== targetId);
      simpanDatabaseProject(baru);
      return NextResponse.json({ ok: true, projects: baru });
    }

    return NextResponse.json({ ok: false, message: "Action tidak valid" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, message: "Gagal memproses JSON project" }, { status: 400 });
  }
}