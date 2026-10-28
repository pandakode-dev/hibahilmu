// app/api/mobile/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AKUN_DEFAULT } from "../../../mockData";
import { AkunPengguna } from "../../../types";

// Database akun di memori server (Memuat seluruh akun asli dari mockData.ts)
export const SERVER_ACCOUNTS_DB: AkunPengguna[] = [...AKUN_DEFAULT];

export async function GET() {
  return NextResponse.json({
    ok: true,
    server: "HibahIlmu Central Auth Server",
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
    const action: "login" | "register" = body.action || "login";

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
              "Akun tidak ditemukan di server hibahilmu.my.id atau password salah! Silakan daftar akun terlebih dahulu.",
          },
          { status: 401 }
        );
      }

      if (akunKetemu.status === "rejected") {
        return NextResponse.json(
          {
            ok: false,
            message: "Akun Anda ditolak oleh Admin server.",
          },
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
            message: "Nama, email, dan password (minimal 4 karakter) wajib diisi!",
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