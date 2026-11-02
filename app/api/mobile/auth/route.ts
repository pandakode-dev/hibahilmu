// app/api/mobile/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AKUN_DEFAULT } from "../../../mockData";
import { AkunPengguna } from "../../../types";

export const SERVER_ACCOUNTS_DB: AkunPengguna[] = [...AKUN_DEFAULT];

export async function GET() {
  return NextResponse.json({
    ok: true,
    server: "HibahIlmu Central Auth & Google SSO Server",
    totalAkunTerdaftar: SERVER_ACCOUNTS_DB.length,
    daftarEmailTerdaftar: SERVER_ACCOUNTS_DB.map((a) => ({
      nama: a.nama,
      email: a.email,
      role: a.role,
      status: a.status,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "login" | "register" | "google_sso" = body.action || "login";

    // ========================================================================
    // 1. HANDLER KHUSUS LOGIN / REGISTER VIA GOOGLE SSO (WEB & ANDROID NATIVE)
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

      // Jika mengirim idToken resmi dari Google Sign-In / Credential Manager
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
        // Fallback jika menggunakan Google OAuth Profile Payload
        emailGoogle = (body.email || "").trim().toLowerCase();
        namaGoogle = (body.nama || "").trim();
        googleSubId = body.googleId || Date.now().toString();
      } else {
        return NextResponse.json(
          {
            ok: false,
            message: "Data kredensial Google SSO kosong!",
          },
          { status: 400 }
        );
      }

      // Cek apakah email Google ini sudah terdaftar di SERVER_ACCOUNTS_DB
      let akun = SERVER_ACCOUNTS_DB.find(
        (u) => u.email.toLowerCase() === emailGoogle
      );

      if (!akun) {
        // Jika belum pernah daftar -> OTOMATIS REGISTRASI AKUN BARU (AUTO-PROVISIONING)
        akun = {
          id: `usr-google-${googleSubId.slice(-8)}`,
          nama: namaGoogle,
          email: emailGoogle,
          password: `GOOGLE_SSO_${googleSubId}`,
          role: rolePilihan,
          status: "approved",
          infoTambahan: `${instansiInput} (Terverifikasi Google SSO)`,
          waktuDaftar: new Date().toLocaleDateString("id-ID"),
          xp: 550, // Bonus +50 XP untuk pengguna Google Verified
        };
        SERVER_ACCOUNTS_DB.unshift(akun);
      }

      if (akun.status === "rejected") {
        return NextResponse.json(
          { ok: false, message: "Akun Anda ditolak oleh Admin server." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        ok: true,
        message: `Berhasil masuk dengan Google sebagai ${akun.nama}!`,
        user: {
          id: akun.id,
          nama: akun.nama,
          email: akun.email,
          role: akun.role,
          status: akun.status,
          instansi: akun.infoTambahan || "Google Verified Account",
          xp: akun.xp || 550,
        },
      });
    }

    // ========================================================================
    // 2. HANDLER LOGIN REGULER (EMAIL & PASSWORD)
    // ========================================================================
    if (action === "login") {
      const emailInput = (body.email || "").trim().toLowerCase();
      const passInput = body.password || "";

      const akunKetemu = SERVER_ACCOUNTS_DB.find(
        (u) => u.email.toLowerCase() === emailInput && u.password === passInput
      );

      if (!akunKetemu) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Akun tidak ditemukan di server hibahilmu.my.id atau password salah! Silakan daftar atau gunakan tombol Login Google.",
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
        message: `Selamat datang kembali di server HibahIlmu, ${akunKetemu.nama}!`,
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

      if (!nama || !email || password.length < 4) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Nama, email, dan password (minimal 4 karakter) wajib diisi!",
          },
          { status: 400 }
        );
      }

      const sudahAda = SERVER_ACCOUNTS_DB.some(
        (u) => u.email.toLowerCase() === email
      );
      if (sudahAda) {
        return NextResponse.json(
          {
            ok: false,
            message: `Email ${email} sudah terdaftar di server hibahilmu.my.id! Silakan langsung Login.`,
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
        waktuDaftar: new Date().toLocaleDateString("id-ID"),
        xp: 500,
      };

      SERVER_ACCOUNTS_DB.unshift(akunBaru);

      return NextResponse.json({
        ok: true,
        message: "Registrasi berhasil disimpan di server hibahilmu.my.id!",
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