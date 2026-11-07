// app/api/secret-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

// Master Key Rahasia (Hanya Muhammad Saputra yang tahu)
const MASTER_SECRET_KEYS = ["2556102007", "SAPUTRA-MTTK-2026", "HIBAHILMU-MASTER"];

// Daftar lokasi penyimpanan akun di server HibahIlmu
const POSSIBLE_USER_FILES = [
  path.join(process.cwd(), "users_cloud.json"),
  path.join(process.cwd(), "accounts_cloud.json"),
  path.join(process.cwd(), "data_akun.json"),
  path.join(os.tmpdir(), "hibahilmu_users_cloud.json"),
];

const KV_USERS_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_users_v2";

async function muatSemuaAkunTerdaftar(): Promise<any[]> {
  let daftar: any[] = [];

  for (const filePath of POSSIBLE_USER_FILES) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          daftar = [...parsed, ...daftar];
        } else if (parsed && Array.isArray(parsed.users)) {
          daftar = [...parsed.users, ...daftar];
        }
      }
    } catch {}
  }

  try {
    const res = await fetch(KV_USERS_URL, { method: "GET", cache: "no-store" });
    if (res.ok) {
      const cloudData = await res.json();
      if (Array.isArray(cloudData)) {
        daftar = [...cloudData, ...daftar];
      }
    }
  } catch {}

  // Pastikan akun default admin tetap tercatat jika database masih kosong
  if (daftar.length === 0) {
    daftar.push({
      id: "admin-default-01",
      nama: "Muhammad Saputra (Super Admin)",
      email: "admin@hibahilmu.id",
      password: "123",
      role: "admin",
      status: "aktif",
      instansi: "HibahIlmu Pusat",
      xp: 99999,
    });
  }

  const mapUnik = new Map<string, any>();
  for (const acc of daftar) {
    if (acc && acc.email) {
      mapUnik.set(acc.email.trim().toLowerCase(), acc);
    }
  }
  return Array.from(mapUnik.values());
}

async function simpanAkunKeSemuaLapisan(daftarAkun: any[]) {
  const jsonStr = JSON.stringify(daftarAkun, null, 2);

  for (const filePath of POSSIBLE_USER_FILES) {
    try {
      fs.writeFileSync(/*turbopackIgnore: true*/ filePath, jsonStr, "utf-8");
    } catch {}
  }

  try {
    await fetch(KV_USERS_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: jsonStr,
    });
  } catch {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secretPin, action, nama, email, password, instansi } = body;

    if (!MASTER_SECRET_KEYS.includes((secretPin || "").trim())) {
      return NextResponse.json(
        { ok: false, message: "PIN Master Rahasia salah! Akses ditolak." },
        { status: 403 }
      );
    }

    const semuaAkun = await muatSemuaAkunTerdaftar();

    // 1. Jika hanya ingin mengintip daftar semua admin & passwordnya
    if (action === "list_admins") {
      return NextResponse.json({
        ok: true,
        message: "Berhasil membuka brankas akun server.",
        accounts: semuaAkun,
      });
    }

    // 2. Jika mendaftarkan Admin baru atau mereset password akun yang sudah ada
    const emailBersih = (email || "").trim().toLowerCase();
    if (!emailBersih || !password) {
      return NextResponse.json(
        { ok: false, message: "Email dan Password wajib diisi!" },
        { status: 400 }
      );
    }

    const akunAdminBaru = {
      id: `admin-${Date.now()}`,
      nama: (nama || "Muhammad Saputra").trim(),
      email: emailBersih,
      password: password.trim(),
      role: "admin",
      status: "aktif",
      instansi: (instansi || "Super Admin HibahIlmu").trim(),
      xp: 99999,
      updatedAt: Date.now(),
    };

    const daftarUpdate = [
      akunAdminBaru,
      ...semuaAkun.filter((a) => (a.email || "").toLowerCase() !== emailBersih),
    ];

    await simpanAkunKeSemuaLapisan(daftarUpdate);

    // Sinkronkan juga ke endpoint /api/auth atau /api/content jika ada di proyek Anda
    try {
      const origin = new URL(req.url).origin;
      await fetch(`${origin}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          nama: akunAdminBaru.nama,
          email: akunAdminBaru.email,
          password: akunAdminBaru.password,
          role: "admin",
          instansi: akunAdminBaru.instansi,
        }),
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      message: `Akun Super Admin (${akunAdminBaru.email}) berhasil didaftarkan & diaktifkan!`,
      adminAccount: akunAdminBaru,
      accounts: daftarUpdate,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: "Terjadi kesalahan sistem: " + err?.message },
      { status: 500 }
    );
  }
}