// app/api/mobile/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AKUN_DEFAULT } from "../../../mockData";
import { AkunPengguna } from "../../../types";

// Database akun di memori server (Menggunakan data awal dari AKUN_DEFAULT)
const SERVER_USERS_DB: AkunPengguna[] = [...AKUN_DEFAULT];

export async function GET() {
  return NextResponse.json({
    ok: true,
    server: "HibahIlmu Central Auth Server",
    totalUsers: SERVER_USERS_DB.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action: "login" | "register" = body.action || "login";

    if (action === "login") {
      const email = (body.email || "").trim().toLowerCase();
      const password = body.password || "";

      const user = SERVER_USERS_DB.find(
        (u) => u.email.toLowerCase() === email && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Akun tidak ditemukan di Server hibahilmu.my.id atau Password salah!",
          },
          { status: 401 }
        );
      }

      if (user.status === "rejected") {
        return NextResponse.json(
          { ok: false, error: "Akun Anda ditangguhkan oleh Admin." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        ok: true,Agar aplikasi Android **HibahIlmu** berjalan **100% Native** (tanpa menggunakan `WebView` sama sekali) dan proses **Login / Register wajib terhubung ke internet untuk memvalidasi akun langsung di server `https://www.hibahilmu.my.id`**, kita harus membangun **Jembatan REST API Backend** di proyek Next.js Anda terlebih dahulu, lalu mengubah aplikasi Kotlin Android agar seluruh layarnya dirender menggunakan komponen asli Jetpack Compose.

Berikut adalah arsitektur lengkapnya yang kita bangun secara bertahap dan bersih:
1. **Di Server Next.js (`hibahilmu.my.id`)**: Membuat 2 Endpoint API baru:
   * `/api/mobile/auth` (`POST` & `GET`): Memvalidasi Login dan mendaftarkan akun baru langsung di database server (mengambil data asli dari `AKUN_DEFAULT` + akun baru yang mendaftar). Jika HP tidak ada internet atau akun tidak terdaftar di server, **Login otomatis ditolak!**
   * `/api/mobile/content` (`GET` & `POST`): Mengirimkan data asli dari server (`STRUKTUR_AWAL` Jenjang/Modul/Bab/Kuis, `PAKET_TRYOUT_AWAL` CBT, `AGENDA_WEBINAR_AWAL`, dan `DISKUSI_PR_AWAL`) ke aplikasi Android dalam format JSON murni.
2. **Di Aplikasi Android (Kotlin Jetpack Compose 100% Native)**:
   * Menghapus `WebView` sepenuhnya.
   * Membuat **5 Menu Bottom Navigation Native**:
     1. **Kelas Native**: Menampilkan daftar Jenjang, daftar Modul, baca Materi per Bab, dan mengerjakan Kuis Interaktif langsung di layar native Android.
     2. **IoT & Blynk Native**: Mengontrol Virtual Pin (`V0`–`V4`), membaca sensor, dan memilih preset proyek IoT yang langsung tersinkronisasi dengan server `hibahilmu.my.id`.
     3. **CBT Tryout Native**: Mengerjakan soal ujian Tryout langsung dengan *timer* hitung mundur native dan perhitungan skor otomatis ke server.
     4. **Webinar & Forum PR Native**: Melihat jadwal live webinar, mengirim pertanyaan PR baru, dan membalas diskusi langsung ke database server.
     5. **Profil & Token Native**: Informasi akun terverifikasi server, XP, dan salin token unik IoT.

---

## 🌐 BAGIAN 1: Tambahkan 2 File API di Proyek Web Next.js (`hibahilmu.my.id`)

Buka proyek **Next.js** Anda di VS Code, lalu buat 2 file API berikut dan *push* ke GitHub agar Vercel memperbarui server `https://www.hibahilmu.my.id`.

### 📄 1. Buat File: `app/api/mobile/auth/route.ts`
Buat folder **`api/mobile/auth`** di dalam folder **`app/`**, lalu buat file **`app/api/mobile/auth/route.ts`**:

```tsx
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