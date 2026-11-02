// app/api/mobile/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AKUN_DEFAULT } from "../../../mockData";
import { AkunPengguna } from "../../../types";

const DB_ACCOUNTS_PATH = path.join(process.cwd(), "accounts_database.json");

const globalForAccounts = globalThis as unknown as {
  hibahIlmuAccountsDb?: AkunPengguna[];
};

function muatDatabaseAkun(): AkunPengguna[] {
  if (
    globalForAccounts.hibahIlmuAccountsDb &&
    globalForAccounts.hibahIlmuAccountsDb.length > 0
  ) {
    return globalForAccounts.hibahIlmuAccountsDb;
  }
  try {
    if (fs.existsSync(DB_ACCOUNTS_PATH)) {
      const raw = fs.readFileSync(DB_ACCOUNTS_PATH, "utf-8");
      const parsed = JSON.parse(raw) as AkunPengguna[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalForAccounts.hibahIlmuAccountsDb = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback jika berjalan di environment serverless read-only
  }
  globalForAccounts.hibahIlmuAccountsDb = [...AKUN_DEFAULT];
  return globalForAccounts.hibahIlmuAccountsDb;
}

function simpanDatabaseAkun(list: AkunPengguna[]) {
  globalForAccounts.hibahIlmuAccountsDb = list;
  try {
    fs.writeFileSync(DB_ACCOUNTS_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch {
    // Fallback aman untuk Vercel serverless
  }
}

export async function GET() {
  const db = muatDatabaseAkun();
  return NextResponse.json({
    ok: true,
    server: "HibahIlmu Central Auth & Google SSO Server",
    totalAkunTerdaftar: db.length,
    accounts: db,
    daftarEmailTerdaftar: db.map((a) => ({
      id: a.id,
      nama: a.nama,
      email: a.email,
      role: a.role,
      status: a.status,
      infoTambahan: a.infoTambahan,
      waktuDaftar: a.waktuDaftar,
      xp: a.xp || 500,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action:
      | "login"
      | "register"
      | "google_sso"
      | "admin_update_status"
      | "admin_delete_user" = body.action || "login";

    const db = muatDatabaseAkun();

    // ========================================================================
    // 1. HANDLER LOGIN / REGISTER VIA GOOGLE SSO (WEB & ANDROID NATIVE)
    // ========================================================================
    if (action === "google_sso") {
      const idToken: string = body.idToken || "";
      const rolePilihan: "siswa" | "guru" =
        body.role === "guru" ? "guru" : "siswa";
      const instansiInput: string =
        (body.instansi || "").trim() || "Google Verified Account";

      let emailGoogle = "";
      let namaGoogle = "";
      let googleSubId = "";

      if (idToken) {
        const googleVerifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
            idToken
          )}`
        );
        if (!googleVerifyRes.ok) {
          return NextResponse.json(
            {
              ok: false,
              message:
                "Token Google SSO tidak valid atau sudah kedaluwarsa! Silakan ulangi login Google.",
            },
            { status: 401 }
          );
        }
        const tokenInfo = await googleVerifyRes.json();
        emailGoogle = (tokenInfo.email || "").toLowerCase();
        namaGoogle =
          tokenInfo.name ||
          emailGoogle.split("@")[0] ||
          "Pengguna Google HibahIlmu";
        googleSubId = tokenInfo.sub || Date.now().toString();
      } else if (body.email && body.nama) {
        emailGoogle = (body.email || "").trim().toLowerCase();
        namaGoogle = (body.nama || "").trim();
        googleSubId = body.googleId || Date.now().toString();
      } else {
        return NextResponse.json(
          { ok: false, message: "Kredensial Google SSO kosong!" },
          { status: 400 }
        );
      }

      const akunLama = db.find(
        (u) => u.email.toLowerCase() === emailGoogle
      );

      let akunFinal: AkunPengguna;

      if (!akunLama) {
        // Buat objek AkunPengguna murni yang 100% sesuai dengan types.ts
        akunFinal = {
          id: `usr-google-${googleSubId.slice(-8)}`,
          nama: namaGoogle,
          email: emailGoogle,
          password: `GOOGLE_SSO_${googleSubId}`,
          role: rolePilihan,
          status: "approved",
          infoTambahan: `${instansiInput} (Google SSO)`,
          waktuDaftar: new Date().toLocaleString("id-ID"),
          xp: 550,
        };
        db.unshift(akunFinal);
        simpanDatabaseAkun(db);
      } else {
        if (body.role && akunLama.role !== "admin") {
          akunLama.role = rolePilihan;
          simpanDatabaseAkun(db);
        }
        akunFinal = akunLama;
      }

      if (akunFinal.status === "rejected") {
        return NextResponse.json(
          { ok: false, message: "Akun Anda ditolak oleh Admin server." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: `Berhasil masuk dengan Google sebagai ${akunFinal.nama} (${akunFinal.role.toUpperCase()})!`,
        totalAkunTerdaftar: db.length,
        accounts: db,
        user: {
          id: akunFinal.id,
          nama: akunFinal.nama,
          email: akunFinal.email,
          role: akunFinal.role,
          status: akunFinal.status,
          instansi: akunFinal.infoTambahan || "Google Verified Account",
          xp: akunFinal.xp || 550,
        },
      });
    }

    // ========================================================================
    // 2. HANDLER LOGIN REGULER (EMAIL & PASSWORD)
    // ========================================================================
    if (action === "login") {
      const emailInput = (body.email || "").trim().toLowerCase();
      const passInput = body.password || "";

      const akunKetemu = db.find(
        (u) => u.email.toLowerCase() === emailInput && u.password === passInput
      );

      if (!akunKetemu) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Akun tidak ditemukan di server hibahilmu.my.id atau password salah!",
          },
          { status: 401 }
        );
      }

      if (akunKetemu.status === "rejected") {
        return NextResponse.json(
          { ok: false, message: "Akun Anda ditolak oleh Admin server." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: `Selamat datang kembali, ${akunKetemu.nama}!`,
        accounts: db,
        user: {
          id: akunKetemu.id,
          nama: akunKetemu.nama,
          email: akunKetemu.email,
          role: akunKetemu.role,
          status: akunKetemu.status,
          instansi: akunKetemu.infoTambahan || "HibahIlmu Indonesia",
          xp: akunKetemu.xp || 500,
        },
      });
    }

    // ========================================================================
    // 3. HANDLER REGISTER REGULER
    // ========================================================================
    if (action === "register") {
      const nama = (body.nama || "").trim();
      const email = (body.email || "").trim().toLowerCase();
      const password = body.password || "";
      const role: "siswa" | "guru" = body.role === "guru" ? "guru" : "siswa";
      const instansi = (body.instansi || "Umum").trim();

      if (!nama || !email || password.length < 3) {
        return NextResponse.json(
          { ok: false, message: "Nama, email, dan password wajib diisi!" },
          { status: 400 }
        );
      }

      if (db.some((u) => u.email.toLowerCase() === email)) {
        return NextResponse.json(
          {
            ok: false,
            message: `Email ${email} sudah terdaftar di server! Silakan langsung Login.`,
          },
          { status: 409 }
        );
      }

      const akunBaru: AkunPengguna = {
        id: `usr-mob-${Date.now()}`,
        nama,
        email,
        password,
        role,
        status: "approved",
        infoTambahan: instansi,
        waktuDaftar: new Date().toLocaleString("id-ID"),
        xp: 500,
      };

      db.unshift(akunBaru);
      simpanDatabaseAkun(db);

      return NextResponse.json({
        ok: true,
        message: "Registrasi berhasil disimpan di server hibahilmu.my.id!",
        totalAkunTerdaftar: db.length,
        accounts: db,
        user: {
          id: akunBaru.id,
          nama: akunBaru.nama,
          email: akunBaru.email,
          role: akunBaru.role,
          status: akunBaru.status,
          instansi: akunBaru.infoTambahan,
          xp: akunBaru.xp || 500,
        },
      });
    }

    // ========================================================================
    // 4. HANDLER ADMIN KELOLA AKUN
    // ========================================================================
    if (action === "admin_update_status") {
      const targetId = body.userId;
      const statusBaru: "approved" | "rejected" | "pending" =
        body.status || "approved";
      const baru = db.map((u) =>
        u.id === targetId ? { ...u, status: statusBaru } : u
      );
      simpanDatabaseAkun(baru);
      return NextResponse.json({ ok: true, accounts: baru });
    }

    if (action === "admin_delete_user") {
      const targetId = body.userId;
      const baru = db.filter((u) => u.id !== targetId || u.role === "admin");
      simpanDatabaseAkun(baru);
      return NextResponse.json({ ok: true, accounts: baru });
    }

    return NextResponse.json(
      { ok: false, message: "Action tidak dikenali" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Format request JSON tidak valid" },
      { status: 400 }
    );
  }
}