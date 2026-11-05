// app/api/mobile/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const DB_LOCAL_PATH = path.join(process.cwd(), "mobile_users_db.json");
const DB_TMP_PATH = path.join(os.tmpdir(), "pandamuslim_hibahilmu_users_db.json");

// Cloud KV Store agar akun tersinkronisasi lintas perangkat & instance Vercel
const KV_AUTH_URL = "https://kvdb.io/A2x9kL5mP8qR3vW7yZ1n/hibahilmu_pandamuslim_auth_v3";

export interface MobileUserAccount {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: "siswa" | "guru" | "admin";
  status: "approved" | "pending";
  instansi: string;
  waktuDaftar: string;
  xp: number;
}

const AKUN_AWAL_RESMI: MobileUserAccount[] = [
  {
    id: "admin-1",
    nama: "Admin PandaMuslim & HibahIlmu",
    email: "admin@hibahilmu.id",
    password: "admin123",
    role: "admin",
    status: "approved",
    instansi: "Panda Kode Pusat",
    waktuDaftar: "Terverifikasi",
    xp: 9999,
  },
  {
    id: "guru-1",
    nama: "Ustadz / Pengajar Budi, M.Pd",
    email: "guru@hibahilmu.id",
    password: "guru123",
    role: "guru",
    status: "approved",
    instansi: "Sahabat Al-Quran & Sains",
    waktuDaftar: "Terverifikasi",
    xp: 2500,
  },
  {
    id: "siswa-1",
    nama: "Aisyah Putri",
    email: "siswa@hibahilmu.id",
    password: "siswa123",
    role: "siswa",
    status: "approved",
    instansi: "Santri / Siswa Aktif",
    waktuDaftar: "Terverifikasi",
    xp: 850,
  },
];

const globalForAuth = globalThis as unknown as {
  mobileAuthUsersDb?: MobileUserAccount[];
};

function gabungkanAkunUnik(lists: MobileUserAccount[][]): MobileUserAccount[] {
  const map = new Map<string, MobileUserAccount>();
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const acc of list) {
      if (!acc || !acc.email) continue;
      const key = acc.email.trim().toLowerCase();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, acc);
      } else {
        // Jika salah satu sudah "approved", prioritaskan status "approved"
        map.set(key, {
          ...existing,
          ...acc,
          status:
            existing.status === "approved" || acc.status === "approved"
              ? "approved"
              : "pending",
        });
      }
    }
  }
  return Array.from(map.values());
}

async function muatDatabaseUser(): Promise<MobileUserAccount[]> {
  let listGabung: MobileUserAccount[] =
    globalForAuth.mobileAuthUsersDb || [...AKUN_AWAL_RESMI];

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_TMP_PATH)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        listGabung = gabungkanAkunUnik([parsed, listGabung]);
      }
    }
  } catch {}

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH)) {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        listGabung = gabungkanAkunUnik([parsed, listGabung]);
      }
    }
  } catch {}

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(KV_AUTH_URL, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(t);
    if (res.ok) {
      const cloudData = await res.json();
      if (Array.isArray(cloudData)) {
        listGabung = gabungkanAkunUnik([cloudData, listGabung]);
      }
    }
  } catch {}

  globalForAuth.mobileAuthUsersDb = listGabung;
  return listGabung;
}

async function simpanDatabaseUser(users: MobileUserAccount[]) {
  globalForAuth.mobileAuthUsersDb = users;
  const str = JSON.stringify(users, null, 2);

  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_TMP_PATH, str, "utf-8");
  } catch {}
  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ DB_LOCAL_PATH, str, "utf-8");
  } catch {}

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2000);
    await fetch(KV_AUTH_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: str,
      signal: controller.signal,
    });
    clearTimeout(t);
  } catch {}
}

// Fungsi decode JWT Google idToken tanpa library eksternal yang berat
function decodeGoogleJwtPayload(idToken?: string): {
  email?: string;
  name?: string;
  sub?: string;
} | null {
  if (!idToken || !idToken.includes(".")) return null;
  try {
    const base64Url = idToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function GET() {
  const users = await muatDatabaseUser();
  return NextResponse.json(
    {
      ok: true,
      total: users.length,
      accounts: users,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = (body.action || "login").trim();
    const users = await muatDatabaseUser();

    // ========================================================================
    // 1. GOOGLE SSO (WAJIB LANGSUNG APPROVED TANPA MENUNGGU PERSETUJUAN ADMIN)
    // ========================================================================
    if (action === "google_sso") {
      const payloadJwt = decodeGoogleJwtPayload(body.idToken);
      const emailSso = (
        body.email ||
        payloadJwt?.email ||
        "sahabat.google@pandamuslim.id"
      )
        .trim()
        .toLowerCase();
      const namaSso =
        body.nama ||
        payloadJwt?.name ||
        emailSso.split("@")[0].replace(/[._]/g, " ");
      const rolePilihan: "siswa" | "guru" | "admin" =
        body.role === "guru" || body.role === "admin" ? body.role : "siswa";
      const instansiSso = body.instansi || "Terverifikasi Google SSO";

      const idxLama = users.findIndex(
        (u) => u.email.toLowerCase() === emailSso
      );

      if (idxLama >= 0) {
        // Jika akun sebelumnya sempat "pending", otomatis ubah jadi "approved"!
        users[idxLama] = {
          ...users[idxLama],
          nama: users[idxLama].nama || namaSso,
          role: body.role || users[idxLama].role || "siswa",
          status: "approved",
          instansi: users[idxLama].instansi || instansiSso,
        };
        await simpanDatabaseUser(users);

        return NextResponse.json({
          ok: true,
          status: "approved",
          message: "Berhasil masuk cepat dengan Google SSO!",
          user: users[idxLama],
          accounts: users,
        });
      }

      // Buat akun Google SSO baru dengan status langsung "approved"
      const akunSsoBaru: MobileUserAccount = {
        id: "sso-" + Date.now(),
        nama: namaSso,
        email: emailSso,
        password: "",
        role: rolePilihan,
        status: "approved",
        instansi: instansiSso,
        waktuDaftar: "Hari ini (Google SSO)",
        xp: 550,
      };

      const listBaru = [akunSsoBaru, ...users];
      await simpanDatabaseUser(listBaru);

      return NextResponse.json({
        ok: true,
        status: "approved",
        message: "Akun Google SSO berhasil dibuat dan langsung disetujui!",
        user: akunSsoBaru,
        accounts: listBaru,
      });
    }

    // ========================================================================
    // 2. REGISTRASI EMAIL MANUAL (LANGSUNG APPROVED AGAR TIDAK MENGHAMBAT USER)
    // ========================================================================
    if (action === "register") {
      const emailReg = (body.email || "").trim().toLowerCase();
      const passwordReg = body.password || "";
      const namaReg = (body.nama || emailReg.split("@")[0]).trim();
      const roleReg: "siswa" | "guru" | "admin" =
        body.role === "guru" ? "guru" : "siswa";

      if (!emailReg || !passwordReg) {
        return NextResponse.json(
          { ok: false, message: "Email dan password wajib diisi!" },
          { status: 400 }
        );
      }

      const sudahAda = users.find((u) => u.email.toLowerCase() === emailReg);
      if (sudahAda) {
        // Jika sudah ada, langsung izinkan masuk & aktifkan
        sudahAda.status = "approved";
        await simpanDatabaseUser(users);
        return NextResponse.json({
          ok: true,
          status: "approved",
          message: "Akun sudah terdaftar dan langsung diaktifkan!",
          user: sudahAda,
          accounts: users,
        });
      }

      const akunBaru: MobileUserAccount = {
        id: "usr-" + Date.now(),
        nama: namaReg,
        email: emailReg,
        password: passwordReg,
        role: roleReg,
        status: "approved",
        instansi: body.instansi || "PandaMuslim & HibahIlmu",
        waktuDaftar: new Date().toLocaleDateString("id-ID"),
        xp: 500,
      };

      const listBaru = [akunBaru, ...users];
      await simpanDatabaseUser(listBaru);

      return NextResponse.json({
        ok: true,
        status: "approved",
        message: "Pendaftaran berhasil dan akun langsung aktif!",
        user: akunBaru,
        accounts: listBaru,
      });
    }

    // ========================================================================
    // 3. LOGIN MANUAL EMAIL & PASSWORD
    // ========================================================================
    if (action === "login") {
      const emailInput = (body.email || "").trim().toLowerCase();
      const passInput = body.password || "";

      const akun = users.find((u) => u.email.toLowerCase() === emailInput);
      if (!akun) {
        return NextResponse.json(
          {
            ok: false,
            message: "Email belum terdaftar. Silakan gunakan Google SSO atau Daftar.",
          },
          { status: 401 }
        );
      }

      if (akun.password && akun.password !== passInput) {
        return NextResponse.json(
          { ok: false, message: "Password yang Anda masukkan salah!" },
          { status: 401 }
        );
      }

      // Pastikan akun yang berhasil login langsung berstatus approved
      akun.status = "approved";
      await simpanDatabaseUser(users);

      return NextResponse.json({
        ok: true,
        status: "approved",
        message: "Berhasil masuk!",
        user: akun,
        accounts: users,
      });
    }

    // ========================================================================
    // 4. APPROVE AKUN OLEH ADMIN
    // ========================================================================
    if (action === "approve") {
      const targetEmail = (body.email || "").trim().toLowerCase();
      const updated = users.map((u) =>
        u.email.toLowerCase() === targetEmail
          ? { ...u, status: "approved" as const }
          : u
      );
      await simpanDatabaseUser(updated);
      return NextResponse.json({ ok: true, accounts: updated });
    }

    return NextResponse.json(
      { ok: false, message: "Action tidak dikenali" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Gagal memproses permintaan autentikasi" },
      { status: 400 }
    );
  }
}