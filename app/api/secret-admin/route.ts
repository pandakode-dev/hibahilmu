// app/api/secret-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const MASTER_SECRET_KEYS = ["2556102007", "humairoh26", "SAPUTRA-MTTK-2026", "HIBAHILMU-MASTER"];

const POSSIBLE_USER_FILES = [
  path.join(process.cwd(), "users_cloud.json"),
  path.join(process.cwd(), "accounts_cloud.json"),
  path.join(process.cwd(), "data_akun.json"),
  path.join(os.tmpdir(), "hibahilmu_users_cloud.json"),
];

const KV_USERS_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_users_v2";

const DEFAULT_ADMINS = [
  {
    id: "admin-saputra-pcr",
    nama: "Muhammad Saputra",
    email: "saputra@pcr.ac.id",
    password: "humairoh26",
    role: "admin",
    status: "aktif",
    instansi: "Politeknik Caltex Riau (Super Admin)",
    xp: 99999,
  },
  {
    id: "admin-saputra-gmail",
    nama: "Muhammad Saputra",
    email: "msaputrap1234@gmail.com",
    password: "humairoh26",
    role: "admin",
    status: "aktif",
    instansi: "HibahIlmu Pusat (Super Admin)",
    xp: 99999,
  },
  {
    id: "admin-default-01",
    nama: "Muhammad Saputra (Super Admin)",
    email: "admin@hibahilmu.id",
    password: "123",
    role: "admin",
    status: "aktif",
    instansi: "HibahIlmu Pusat",
    xp: 99999,
  },
];

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

  const mapUnik = new Map<string, any>();
  for (const acc of daftar) {
    if (acc && acc.email) {
      mapUnik.set(acc.email.trim().toLowerCase(), acc);
    }
  }
  for (const adm of DEFAULT_ADMINS) {
    mapUnik.set(adm.email.toLowerCase(), adm);
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
        { ok: false, message: "PIN Master Rahasia salah! Gunakan 2556102007 atau humairoh26." },
        { status: 403 }
      );
    }

    const semuaAkun = await muatSemuaAkunTerdaftar();

    if (action === "list_admins") {
      await simpanAkunKeSemuaLapisan(semuaAkun);
      return NextResponse.json({
        ok: true,
        message: "Akun saputra@pcr.ac.id (Password: humairoh26) sudah aktif!",
        accounts: semuaAkun,
      });
    }

    const emailBersih = (email || "saputra@pcr.ac.id").trim().toLowerCase();
    const passwordBersih = (password || "humairoh26").trim();

    const akunAdminBaru = {
      id: `admin-${Date.now()}`,
      nama: (nama || "Muhammad Saputra").trim(),
      email: emailBersih,
      password: passwordBersih,
      role: "admin",
      status: "aktif",
      instansi: (instansi || "Politeknik Caltex Riau (Super Admin)").trim(),
      xp: 99999,
      updatedAt: Date.now(),
    };

    const daftarUpdate = [
      akunAdminBaru,
      ...semuaAkun.filter((a) => (a.email || "").toLowerCase() !== emailBersih),
    ];

    await simpanAkunKeSemuaLapisan(daftarUpdate);

    return NextResponse.json({
      ok: true,
      message: `Akun Super Admin (${akunAdminBaru.email}) berhasil diaktifkan!`,
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