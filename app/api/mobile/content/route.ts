// app/api/mobile/content/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  STRUKTUR_AWAL,
  PAKET_TRYOUT_AWAL,
  AGENDA_WEBINAR_AWAL,
  DISKUSI_PR_AWAL,
  BEASISWA_AWAL,
  LAPORAN_BUG_AWAL,
  bersihkanTagHtml,
} from "../../../mockData";
import {
  JenjangItem,
  KelasItem,
  PaketTryout,
  AgendaWebinarItem,
  DiskusiPR,
  JawabanDiskusi,
  PengajuanBeasiswaItem,
  LaporanBugItem,
} from "../../../types";

const globalContent = globalThis as unknown as {
  jenjangDb?: JenjangItem[];
  tryoutDb?: PaketTryout[];
  webinarDb?: AgendaWebinarItem[];
  diskusiDb?: DiskusiPR[];
  beasiswaDb?: PengajuanBeasiswaItem[];
  laporanDb?: LaporanBugItem[];
};

if (!globalContent.jenjangDb) globalContent.jenjangDb = [...STRUKTUR_AWAL];
if (!globalContent.tryoutDb) globalContent.tryoutDb = [...PAKET_TRYOUT_AWAL];
if (!globalContent.webinarDb) globalContent.webinarDb = [...AGENDA_WEBINAR_AWAL];
if (!globalContent.diskusiDb) globalContent.diskusiDb = [...DISKUSI_PR_AWAL];
if (!globalContent.beasiswaDb) globalContent.beasiswaDb = [...BEASISWA_AWAL];
if (!globalContent.laporanDb) globalContent.laporanDb = [...LAPORAN_BUG_AWAL];

export async function GET() {
  const jenjangBersih = (globalContent.jenjangDb || []).map((j) => ({
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

  const tryoutBersih = (globalContent.tryoutDb || []).map((p) => ({
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
    webinarList: globalContent.webinarDb || [],
    forumList: globalContent.diskusiDb || [],
    beasiswaList: globalContent.beasiswaDb || [],
    laporanList: globalContent.laporanDb || [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === "guru_tambah_modul") {
      const idJenjang = body.idJenjang || "sma";
      const templateKelas = STRUKTUR_AWAL[0].kelas[0];

      const modulBaru = {
        ...templateKelas,
        id: "materi-mob-" + Date.now(),
        subJenjangId: idJenjang,
        judul: body.judul || "Modul Baru Pengajar",
        pembuatId: body.pembuatId || "guru-mobile",
        pembuatNama: body.pembuatNama || "Guru HibahIlmu",
        pembuatEmail: "guru@hibahilmu.id",
        tanggalUpload: new Date().toLocaleDateString("id-ID"),
        videoUrl: "",
        durasi: body.durasi || "25 Menit",
        level: (body.level || "Menengah") as "Pemula" | "Menengah" | "Mahir",
        syaratSkorMinimal: 75,
        rangkuman: body.rangkuman || "Materi pembelajaran interaktif.",
        daftarBab: [
          {
            id: "bab-mob-" + Date.now(),
            judulBab: body.judulBab || "Bab 1: Pengenalan & Konsep Inti",
            durasiBab: "15 Menit",
            kontenHtml: body.isiBab || "Isi materi bab utama.",
            rumusMatematika: body.rumus || "",
          },
        ],
        daftarKuis: body.pertanyaanKuis
          ? [
              {
                id: "kuis-mob-" + Date.now(),
                tipe: "pilihan_ganda" as const,
                tanya: body.pertanyaanKuis,
                opsi: [
                  body.opsiA || "Opsi A",
                  body.opsiB || "Opsi B",
                  body.opsiC || "Opsi C",
                  body.opsiD || "Opsi D",
                ],
                jawabanBenar: Number(body.jawabanBenar ?? 0),
                pembahasan: body.pembahasanKuis || "Jawaban sesuai konsep bab.",
                poin: 10,
              },
            ]
          : [],
        diskusi: [],
      } as any;

      globalContent.jenjangDb = (globalContent.jenjangDb || []).map((j) =>
        j.id === idJenjang ? { ...j, kelas: [modulBaru, ...j.kelas] } : j
      );

      return NextResponse.json({
        ok: true,
        message: "Modul kelas & kuis baru berhasil diterbitkan oleh Guru!",
      });
    }

    if (action === "guru_tambah_cbt") {
      const templateCbt = PAKET_TRYOUT_AWAL[0];
      const cbtBaru = {
        ...templateCbt,
        id: "pkt-mob-" + Date.now(),
        judul: body.judul || "Simulasi Tryout CBT Baru",
        kategoriTes: body.kategoriTes || "UTBK",
        jenjang: body.jenjang || "SMA / SMK / Mahasiswa",
        durasiMenit: Number(body.durasiMenit || 20),
        daftarSoal: [
          {
            id: "soal-mob-" + Date.now(),
            pertanyaan: body.pertanyaan || "Pertanyaan CBT #1",
            opsi: [
              body.opsiA || "Pilihan A",
              body.opsiB || "Pilihan B",
              body.opsiC || "Pilihan C",
              body.opsiD || "Pilihan D",
            ],
            jawabanBenar: Number(body.jawabanBenar ?? 0),
            pembahasan: body.pembahasan || "Pembahasan resmi pengajar.",
          },
        ],
      } as any;
      globalContent.tryoutDb = [cbtBaru, ...(globalContent.tryoutDb || [])];
      return NextResponse.json({
        ok: true,
        message: "Paket Ujian CBT baru berhasil ditambahkan ke server!",
      });
    }

    if (action === "guru_tambah_webinar") {
      const templateWb = AGENDA_WEBINAR_AWAL[0];
      const wbBaru = {
        ...templateWb,
        id: "web-mob-" + Date.now(),
        judulAcara: body.judulAcara || "Live Teaching Session",
        kategoriAcara: "Live Streaming Kelas",
        narasumber: body.narasumber || "Pengajar HibahIlmu",
        tanggalWaktu: body.tanggalWaktu || "Sabtu, 19:30 WIB",
        platform: "Zoom Meeting",
        streamAtauJoinUrl: body.url || "https://meet.google.com",
        sedangLive: true,
      } as any;
      globalContent.webinarDb = [wbBaru, ...(globalContent.webinarDb || [])];
      return NextResponse.json({
        ok: true,
        message: "Jadwal Live Webinar berhasil diterbitkan!",
      });
    }

    if (action === "tambah_diskusi") {
      const templatePr = DISKUSI_PR_AWAL[0];
      const baru = {
        ...templatePr,
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
      } as any;
      globalContent.diskusiDb = [baru, ...(globalContent.diskusiDb || [])];
      return NextResponse.json({
        ok: true,
        message: "Pertanyaan berhasil diterbitkan ke server!",
      });
    }

    if (action === "balas_diskusi") {
      const targetId = body.diskusiId;
      const balasanBaru = {
        id: "jwb-mob-" + Date.now(),
        penjawab: body.penjawab || "Pengajar HibahIlmu",
        rolePenjawab: body.role === "guru" ? "Guru" : "Siswa",
        isi: body.isiJawaban || "",
        waktu: "Baru saja",
        upvotes: 1,
      } as any;
      globalContent.diskusiDb = (globalContent.diskusiDb || []).map((d: any) =>
        d.id === targetId
          ? {
              ...d,
              solved: body.role === "guru" ? true : d.solved,
              jawaban: [...(d.jawaban || []), balasanBaru],
            }
          : d
      );
      return NextResponse.json({
        ok: true,
        message: "Jawaban berhasil dikirim!",
      });
    }

    if (action === "ajukan_beasiswa") {
      const templateBsw = BEASISWA_AWAL[0];
      const bBaru = {
        ...templateBsw,
        id: "bsw-mob-" + Date.now(),
        pemohonId: body.pemohonId || "siswa-mob",
        pemohonNama: body.namaPemohon || "Siswa HibahIlmu",
        alasanPengajuan: body.alasan || "Membutuhkan bantuan biaya pendidikan.",
        status: "Menunggu Verifikasi",
        tanggalAjuan: new Date().toLocaleDateString("id-ID"),
      } as any;
      globalContent.beasiswaDb = [bBaru, ...(globalContent.beasiswaDb || [])];
      return NextResponse.json({
        ok: true,
        message: "Pengajuan Beasiswa berhasil dikirim ke Admin Server!",
      });
    }

    if (action === "kirim_laporan") {
      const templateLap = LAPORAN_BUG_AWAL[0];
      const lapBaru = {
        ...templateLap,
        id: "lap-mob-" + Date.now(),
        pelaporNama: body.pelaporNama || "Pengguna Android",
        pelaporKontak: body.pelaporRole || "Android App",
        halamanTerkait: body.judul || "Aplikasi Android Native",
        deskripsiDetail: body.deskripsi || "",
        waktuLapor: new Date().toLocaleString("id-ID"),
      } as any;
      globalContent.laporanDb = [lapBaru, ...(globalContent.laporanDb || [])];
      return NextResponse.json({
        ok: true,
        message: "Laporan berhasil diterima oleh server!",
      });
    }

    return NextResponse.json({ ok: false }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
