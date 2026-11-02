// app/api/iot/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ServerSavedProject {
  idProject: string;
  namaProject: string;
  pemilikId: string;
  pemilikNama: string;
  waktuSimpan: string;
  mode: "wokwi" | "ewb" | "matlab";
  nodes: unknown[];
  kabel: unknown[];
  kodePerMcu: Record<string, string>;
  kodeMicroPythonPerMcu: Record<string, string>;
  blynkWidgets: unknown[];
  ruanganFisik?: unknown[];
}

// Memory Store + Persistent File Database (Agar saat PC / Server restart tidak hilang)
const GLOBAL_PROJECTS_MEMORY: Record<string, ServerSavedProject[]> = {};
const DB_FILE_PATH = path.join(process.cwd(), "iot_projects_database.json");

function bacaDatabaseDariDisk(): Record<string, ServerSavedProject[]> {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return { ...GLOBAL_PROJECTS_MEMORY, ...parsed };
    }
  } catch {
    // Jika berjalan di environment serverless read-only, gunakan memory store
  }
  return GLOBAL_PROJECTS_MEMORY;
}

function simpanDatabaseKeDisk(db: Record<string, ServerSavedProject[]>) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // Fallback aman untuk Vercel serverless
  }
}

// GET /api/iot/projects?userId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "guest_user";

  const db = bacaDatabaseDariDisk();
  const projectsMilikUser = db[userId] || [];

  return NextResponse.json({
    ok: true,
    userId,
    total: projectsMilikUser.length,
    projects: projectsMilikUser,
  });
}

// POST /api/iot/projects (Simpan Baru / Timpa Save / Save As / Hapus)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "save" | "save_as" | "delete" = body.action || "save";
    const userId: string = body.userId || "guest_user";

    const db = bacaDatabaseDariDisk();
    const listUser = db[userId] || [];

    if (action === "delete") {
      const idHapus = body.idProject;
      const sisa = listUser.filter((p) => p.idProject !== idHapus);
      GLOBAL_PROJECTS_MEMORY[userId] = sisa;
      db[userId] = sisa;
      simpanDatabaseKeDisk(db);

      return NextResponse.json({
        ok: true,
        message: "Project berhasil dihapus dari database server.",
        projects: sisa,
      });
    }

    const projectData: ServerSavedProject = body.project;
    if (!projectData || !projectData.namaProject) {
      return NextResponse.json(
        { ok: false, error: "Data project tidak lengkap" },
        { status: 400 }
      );
    }

    let listTerbaru: ServerSavedProject[];

    if (action === "save") {
      // Cek apakah project dengan ID atau nama yang sama sudah ada -> Timpa (Update)
      const idxAda = listUser.findIndex(
        (p) =>
          p.idProject === projectData.idProject ||
          p.namaProject.toLowerCase() === projectData.namaProject.toLowerCase()
      );
      if (idxAda >= 0) {
        listTerbaru = [...listUser];
        listTerbaru[idxAda] = {
          ...projectData,
          waktuSimpan: new Date().toLocaleString("id-ID"),
        };
      } else {
        listTerbaru = [projectData, ...listUser];
      }
    } else {
      // Save As -> Selalu buat entri project baru dengan ID baru
      const baruSaveAs: ServerSavedProject = {
        ...projectData,
        idProject: "prj-" + Date.now(),
        waktuSimpan: new Date().toLocaleString("id-ID"),
      };
      listTerbaru = [baruSaveAs, ...listUser];
    }

    GLOBAL_PROJECTS_MEMORY[userId] = listTerbaru;
    db[userId] = listTerbaru;
    simpanDatabaseKeDisk(db);

    return NextResponse.json({
      ok: true,
      message:
        action === "save_as"
          ? `Berhasil disimpan sebagai project baru "${projectData.namaProject}"!`
          : `Project "${projectData.namaProject}" berhasil diperbarui di server!`,
      projectAktif: listTerbaru[0],
      projects: listTerbaru,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal memproses penyimpanan database project" },
      { status: 500 }
    );
  }
}