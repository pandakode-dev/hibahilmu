// app/api/mobile/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  STRUKTUR_AWAL,
  PAKET_TRYOUT_AWAL,
  AGENDA_WEBINAR_AWAL,
  DISKUSI_PR_AWAL,
  bersihkanTagHtml,
} from "../../../mockData";

const SERVER_DISKUSI_DB = [...DISKUSI_PR_AWAL];

export async function GET() {
  const jenjangBersih = STRUKTUR_AWAL.map((j) => ({
    id: j.id,
    nama: j.nama,
    tagline: j.tagline,
    deskripsi: j.deskripsi,
    jumlahKelas: j.kelas.length,
    kelas: j.kelas.map((k) => ({
      id: k.id,
      judul: k.judul,
      pembuatNama: k.pembuatNama,
      level: k.level,
      durasi: k.durasi,
      syaratSkorMinimal: k.syaratSkorMinimal || 75,
      rangkumanTeks: bersihkanTagHtml(k.rangkuman),
      daftarBab: (k.daftarBab || []).map((b) => ({
        id: b.id,
        judulBab: b.judulBab,
        durasiBab: b.durasiBab,
        isiTeks: bersihkanTagHtml(b.kontenHtml),
        rumus: b.rumusMatematika || "",
      })),
      daftarKuis: (k.daftarKuis || []).map((q) => ({
        id: q.id,
        tanya: q.tanya,
        opsi: q.opsi,
        jawabanBenar: q.jawabanBenar,
        pembahasan: q.pembahasan,
      })),
    })),
  }));

  const tryoutBersih = PAKET_TRYOUT_AWAL.map((p) => ({
    id: p.id,
    judul: p.judul,
    kategoriTes: p.kategoriTes,
    jenjang: p.jenjang,
    durasiMenit: p.durasiMenit,
    daftarSoal: p.daftarSoal.map((s) => ({
      id: s.id,
      pertanyaan: s.pertanyaan,
      opsi: s.opsi,
      jawabanBenar: s.jawabanBenar,
      pembahasan: s.pembahasan,
    })),
  }));

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toLocaleTimeString("id-ID"),
    jenjangList: jenjangBersih,
    tryoutList: tryoutBersih,
    webinarList: AGENDA_WEBINAR_AWAL,
    forumList: SERVER_DISKUSI_DB,
  });
}

// POST /api/mobile/content -> Untuk mengirim pertanyaan Forum PR baru dari Android ke Server
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "tambah_diskusi") {
      const baru = {
        id: "pr-mob-" + Date.now(),
        penanya: body.penanya || "Pelajar Android",
        jenjang: body.jenjang || "SMA / SMK / Kuliah",
        mapel: body.mapel || "Sains & Pemrograman",
        judul: body.judul || "Pertanyaan Diskusi",
        pertanyaan: body.pertanyaan || "",
        waktu: "Baru saja (via Android Native)",
        likes: 1,
        solved: false,
        jawaban: [],
      };
      SERVER_DISKUSI_DB.unshift(baru);
      return NextResponse.json({
        ok: true,
        message: "Pertanyaan berhasil diterbitkan ke server!",
        forumList: SERVER_DISKUSI_DB,
      });
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}