// app/components/talent-mapping/talentMappingEngine.ts
import {
  DAFTAR_34_BAKAT,
  DAFTAR_30_PERSONAL_BRANDING,
  SOAL_SESI_2_114_SCM,
  TalentDefinition,
  TalentDomain,
  PersonalBrandingRole,
} from "./talentMappingDatabase";

export interface RankedTalentItem extends TalentDefinition {
  peringkat: number; // 1..34
  skorMentah: number; // 5..30
  persentaseKekuatan: number; // 0..100%
  kategoriKekuatan:
    | "Bakat Utama (1-7)"
    | "Bakat Pendukung (8-14)"
    | "Bakat Netral (15-21)"
    | "Bakat Rendah (22-27)"
    | "Bakat Lemah (28-34)";
  warnaHex: string; // Merah (#e11d48), Kuning (#f59e0b), Putih (#f8fafc), Abu (#94a3b8), Hitam (#0f172a)
}

export interface ScmActivityEvaluation {
  no: number;
  kodeAktivitas: string;
  klaster: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
  namaKlaster: string;
  deskripsiSingkat: string;
  typology: string;
  skorPSP: number; // 1..7 (Personal Strength Potential - dari komposisi Bakat Sesi 1)
  skorPSS: number; // 1..7 (Personal Strength Statement - dari jawaban Sesi 2)
  skorKombinasi: number; // 0..100
  warnaPSP: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam";
  warnaPSS: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam";
}

export interface HasilLengkapTalentMapping {
  idHasil: string;
  namaPeserta: string;
  emailPeserta: string;
  instansiPeserta: string;
  jabatanAtauKelas: string;
  tanggalTes: string;
  nomorDokumenRahasia: string;
  urutan34Bakat: RankedTalentItem[];
  bakatUtama1_7: RankedTalentItem[];
  bakatPendukung8_14: RankedTalentItem[];
  bakatLemah28_34: RankedTalentItem[];
  distribusiDomainTop14: Record<TalentDomain, number>;
  duaDomainDominan: [TalentDomain, TalentDomain];
  profilProduktivitasNarasi: string;
  prioritas14Aktivitas: ScmActivityEvaluation[];
  petaLengkap114SCM: ScmActivityEvaluation[];
  top5PersonalBranding: (PersonalBrandingRole & { skorKecocokan: number })[];
  rekomendasiHRBP: {
    talentAcquisitionFit: string;
    peopleDevelopmentPlan: string;
    organizationalPlacement: string;
  };
}

function tentukanWarnaLimaTingkat(
  peringkat: number,
  totalItem: number
): "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam" {
  const rasio = peringkat / totalItem;
  if (rasio <= 0.2) return "Merah";
  if (rasio <= 0.41) return "Kuning";
  if (rasio <= 0.62) return "Putih";
  if (rasio <= 0.8) return "Abu";
  return "Hitam";
}

export function hitungHasilTalentMappingAkurat(params: {
  namaPeserta: string;
  emailPeserta: string;
  instansiPeserta?: string;
  jabatanAtauKelas?: string;
  jawabanSesi1: Record<number, number>; // noSoal (1..170) -> 1..6
  jawabanSesi2: Record<number, number>; // noSoal (1..114) -> 1..7
}): HasilLengkapTalentMapping {
  const {
    namaPeserta,
    emailPeserta,
    instansiPeserta = "HibahIlmu Indonesia",
    jabatanAtauKelas = "Professional / Akademisi",
    jawabanSesi1,
    jawabanSesi2,
  } = params;

  // ==========================================================================
  // 1. HITUNG SKOR 34 BAKAT DARI 170 SOAL SESI 1 (MODULO-34)
  // ==========================================================================
  const skorPerSlot = DAFTAR_34_BAKAT.map((bakat) => {
    let totalSkor = 0;
    for (let k = 0; k < 5; k++) {
      const nomorSoal = bakat.slotIndex + 1 + k * 34;
      const nilai = jawabanSesi1[nomorSoal] ?? 4;
      totalSkor += nilai;
    }
    return {
      bakat,
      skorMentah: totalSkor,
    };
  });

  // Urutkan dari skor tertinggi ke terendah
  skorPerSlot.sort((a, b) => b.skorMentah - a.skorMentah);

  const mapPeringkatBakat = new Map<string, number>();
  const mapSkorBakat = new Map<string, number>();

  const urutan34Bakat: RankedTalentItem[] = skorPerSlot.map((item, idx) => {
    const peringkat = idx + 1;
    mapPeringkatBakat.set(item.bakat.id, peringkat);
    mapSkorBakat.set(item.bakat.id, item.skorMentah);

    const persentaseKekuatan = Math.round(((item.skorMentah - 5) / 25) * 100);

    let kategoriKekuatan: RankedTalentItem["kategoriKekuatan"] =
      "Bakat Netral (15-21)";
    let warnaHex = "#f8fafc";

    if (peringkat <= 7) {
      kategoriKekuatan = "Bakat Utama (1-7)";
      warnaHex = "#e11d48"; // Merah Utama
    } else if (peringkat <= 14) {
      kategoriKekuatan = "Bakat Pendukung (8-14)";
      warnaHex = "#f59e0b"; // Kuning Pendukung
    } else if (peringkat <= 21) {
      kategoriKekuatan = "Bakat Netral (15-21)";
      warnaHex = "#e2e8f0"; // Putih/Terang
    } else if (peringkat <= 27) {
      kategoriKekuatan = "Bakat Rendah (22-27)";
      warnaHex = "#64748b"; // Abu-abu
    } else {
      kategoriKekuatan = "Bakat Lemah (28-34)";
      warnaHex = "#0f172a"; // Hitam
    }

    return {
      ...item.bakat,
      peringkat,
      skorMentah: item.skorMentah,
      persentaseKekuatan,
      kategoriKekuatan,
      warnaHex,
    };
  });

  const bakatUtama1_7 = urutan34Bakat.slice(0, 7);
  const bakatPendukung8_14 = urutan34Bakat.slice(7, 14);
  const bakatLemah28_34 = urutan34Bakat.slice(27, 34);

  // ==========================================================================
  // 2. ANALISIS DOMINASI 4 DOMAIN PADA 14 BAKAT KUAT (URUTAN 1-14)
  // ==========================================================================
  const distribusiDomainTop14: Record<TalentDomain, number> = {
    Thinking: 0,
    Striving: 0,
    Relating: 0,
    Influencing: 0,
  };
  urutan34Bakat.slice(0, 14).forEach((b) => {
    distribusiDomainTop14[b.domain] += 1;
  });

  const urutDomain = (
    Object.entries(distribusiDomainTop14) as [TalentDomain, number][]
  ).sort((a, b) => b[1] - a[1]);

  const duaDomainDominan: [TalentDomain, TalentDomain] = [
    urutDomain[0][0],
    urutDomain[1][0],
  ];

  const profilProduktivitasNarasi = `Berdasarkan sebaran 14 Bakat Kuat (7 Bakat Utama & 7 Bakat Pendukung), profil produktivitas alami ${namaPeserta} didominasi oleh kekuatan ${duaDomainDominan[0]} Talents (${urutDomain[0][1]} bakat) dan ${duaDomainDominan[1]} Talents (${urutDomain[1][1]} bakat). Kombinasi ini menunjukkan kapasitas unggul dalam merumuskan gagasan bernilai tambah, membangun jejaring kolaborasi yang berempati, serta menjaga standar kualitas dan integritas pelaksanaan tugas.`;

  // ==========================================================================
  // 3. HITUNG PETA 114 AKTIVITAS SCM (PSP DARI SESI 1 & PSS DARI SESI 2)
  // ==========================================================================
  const evaluasiMentah114 = SOAL_SESI_2_114_SCM.map((akt) => {
    const skorPSS = jawabanSesi2[akt.no] ?? 4;

    // Hitung PSP dari rata-rata kekuatan bakat penyusunnya di Sesi 1
    let totalBobotPSP = 0;
    akt.bobotBakatIds.forEach((bId) => {
      const rank = mapPeringkatBakat.get(bId) ?? 17;
      // Semakin kecil angka peringkat (mendekati 1), semakin tinggi poin PSP
      const poinRank = ((35 - rank) / 34) * 7;
      totalBobotPSP += poinRank;
    });
    const rataPSP =
      akt.bobotBakatIds.length > 0
        ? totalBobotPSP / akt.bobotBakatIds.length
        : 4;

    // Gabungkan 65% PSP (Potensi Bakat Alami) + 35% PSS (Pernyataan Minat Aktivitas)
    const skorKombinasi = Math.round(((rataPSP * 0.65 + skorPSS * 0.35) / 7) * 100);

    return {
      ...akt,
      skorPSP: Number(rataPSP.toFixed(2)),
      skorPSS,
      skorKombinasi,
    };
  });

  // Tentukan peringkat PSP dan PSS untuk pewarnaan 5 Tingkat (Merah, Kuning, Putih, Abu, Hitam)
  const urutPSP = [...evaluasiMentah114].sort((a, b) => b.skorPSP - a.skorPSP);
  const rankMapPSP = new Map<number, number>();
  urutPSP.forEach((item, i) => rankMapPSP.set(item.no, i + 1));

  const urutPSS = [...evaluasiMentah114].sort((a, b) => b.skorPSS - a.skorPSS);
  const rankMapPSS = new Map<number, number>();
  urutPSS.forEach((item, i) => rankMapPSS.set(item.no, i + 1));

  const petaLengkap114SCM: ScmActivityEvaluation[] = evaluasiMentah114.map(
    (item) => ({
      no: item.no,
      kodeAktivitas: item.kodeAktivitas,
      klaster: item.klaster,
      namaKlaster: item.namaKlaster,
      deskripsiSingkat: item.deskripsiSingkat,
      typology: item.typology,
      skorPSP: item.skorPSP,
      skorPSS: item.skorPSS,
      skorKombinasi: item.skorKombinasi,
      warnaPSP: tentukanWarnaLimaTingkat(rankMapPSP.get(item.no) || 57, 114),
      warnaPSS: tentukanWarnaLimaTingkat(rankMapPSS.get(item.no) || 57, 114),
    })
  );

  // 14 Prioritas Pengembangan & Penugasan Terbaik
  const prioritas14Aktivitas = [...petaLengkap114SCM]
    .sort((a, b) => b.skorKombinasi - a.skorKombinasi)
    .slice(0, 14);

  // ==========================================================================
  // 4. HITUNG TOP 5 PERSONAL BRANDING (30 STRENGTH TYPOLOGY)
  // ==========================================================================
  const skorPerTypology = new Map<string, { total: number; count: number }>();
  petaLengkap114SCM.forEach((akt) => {
    const prev = skorPerTypology.get(akt.typology) || { total: 0, count: 0 };
    skorPerTypology.set(akt.typology, {
      total: prev.total + akt.skorKombinasi,
      count: prev.count + 1,
    });
  });

  // Tambahkan bobot langsung dari Top 14 Bakat
  urutan34Bakat.slice(0, 14).forEach((b, idx) => {
    const bonus = (15 - idx) * 2.5;
    b.typologyTerkait.forEach((typ) => {
      const prev = skorPerTypology.get(typ) || { total: 65, count: 1 };
      skorPerTypology.set(typ, {
        total: prev.total + bonus,
        count: prev.count,
      });
    });
  });

  const top5PersonalBranding = DAFTAR_30_PERSONAL_BRANDING.map((role) => {
    const data = skorPerTypology.get(role.id);
    const skorKecocokan = data
      ? Math.min(99, Math.round(data.total / Math.max(1, data.count)))
      : 60;
    return {
      ...role,
      skorKecocokan,
    };
  })
    .sort((a, b) => b.skorKecocokan - a.skorKecocokan)
    .slice(0, 5);

  // ==========================================================================
  // 5. REKOMENDASI EKSEKUTIF HRBP, TALENT ACQUISITION, & OD SPECIALIST
  // ==========================================================================
  const top3NamaBakat = bakatUtama1_7
    .slice(0, 3)
    .map((b) => b.nama)
    .join(", ");
  const top3Branding = top5PersonalBranding
    .slice(0, 3)
    .map((r) => r.nama)
    .join(", ");
  const top4Aktivitas = prioritas14Aktivitas
    .slice(0, 4)
    .map((a) => a.kodeAktivitas)
    .join(", ");

  return {
    idHasil: "TM-" + Date.now(),
    namaPeserta,
    emailPeserta,
    instansiPeserta,
    jabatanAtauKelas,
    tanggalTes: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    nomorDokumenRahasia: `CONF-HI-TM-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`,
    urutan34Bakat,
    bakatUtama1_7,
    bakatPendukung8_14,
    bakatLemah28_34,
    distribusiDomainTop14,
    duaDomainDominan,
    profilProduktivitasNarasi,
    prioritas14Aktivitas,
    petaLengkap114SCM,
    top5PersonalBranding,
    rekomendasiHRBP: {
      talentAcquisitionFit: `Kandidat/Individu sangat direkomendasikan untuk posisi strategis yang membutuhkan peran ${top3Branding}, dengan keunggulan alami pada ${top3NamaBakat}.`,
      peopleDevelopmentPlan: `Fokuskan investasi pelatihan (Skill & Knowledge) pada aktivitas ${top4Aktivitas} sesuai kerangka T-A-S-K (Talents, Attitude, Skill, Knowledge). Hindari memaksakan tugas rutin yang bertumpu pada bakat urutan 28–34 (${bakatLemah28_34
        .slice(0, 3)
        .map((x) => x.nama)
        .join(", ")}).`,
      organizationalPlacement: `Ditempatkan pada unit kerja yang mengedepankan inovasi konsep, edukasi/pengembangan manusia, komunikasi publik, serta kepatuhan standar mutu (Kombinasi ${duaDomainDominan[0]} & ${duaDomainDominan[1]}).`,
    },
  };
}

// ============================================================================
// PRESET AKURAT SESUAI PDF CONTOH HASIL MUHAMMAD SAPUTRA (UNTUK DEMO INSTAN)
// ============================================================================
export function buatPresetJawabanMuhammadSaputra(): {
  jawabanSesi1: Record<number, number>;
  jawabanSesi2: Record<number, number>;
} {
  // Urutan persis 34 bakat dari PDF contoh hasil Muhammad Saputra:
  const urutanTargetId = [
    "ideation", // 1
    "developer", // 2
    "consistency", // 3
    "belief", // 4
    "adaptability", // 5
    "woo", // 6
    "communication", // 7
    "strategic", // 8
    "learner", // 9
    "futuristic", // 10
    "intellection", // 11
    "deliberative", // 12
    "responsibility", // 13
    "relator", // 14
    "includer", // 15
    "connectedness", // 16
    "restorative", // 17
    "harmony", // 18
    "self_assurance", // 19
    "input", // 20
    "arranger", // 21
    "maximizer", // 22
    "command", // 23
    "individualization", // 24
    "positivity", // 25
    "empathy", // 26
    "analytical", // 27
    "discipline", // 28
    "context", // 29
    "activator", // 30
    "achiever", // 31
    "significance", // 32
    "focus", // 33
    "competition", // 34
  ];

  const jawabanSesi1: Record<number, number> = {};
  DAFTAR_34_BAKAT.forEach((b) => {
    const rankIndex = urutanTargetId.indexOf(b.id);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 17;
    // Buat total skor untuk 5 soal (antara 30 turun ke 7) secara deterministik sesuai urutan PDF
    const targetTotal = Math.max(6, Math.round(30 - ((rank - 1) / 33) * 23));
    const baseVal = Math.floor(targetTotal / 5);
    const remainder = targetTotal % 5;

    for (let k = 0; k < 5; k++) {
      const noSoal = b.slotIndex + 1 + k * 34;
      jawabanSesi1[noSoal] = Math.min(
        6,
        Math.max(1, baseVal + (k < remainder ? 1 : 0))
      );
    }
  });

  // Sesi 2: Prioritaskan 14 aktivitas utama pada PDF Muhammad Saputra
  const top14Kode = new Set([
    "COMMUNICATING",
    "COMPLIANCING",
    "GUIDING",
    "IDEATING",
    "SERVING",
    "ADVISING",
    "SUPPORTING",
    "TRAINING",
    "ASSISTING",
    "PUBLICIZING",
    "INFORMING",
    "PURCHASING",
    "MENTORING",
    "GREETING",
  ]);

  const jawabanSesi2: Record<number, number> = {};
  SOAL_SESI_2_114_SCM.forEach((akt) => {
    if (top14Kode.has(akt.kodeAktivitas)) {
      jawabanSesi2[akt.no] = 7; // Sangat Kuat (14 butir <= batas 22 butir)
    } else if (
      ["N", "S", "Gi"].includes(akt.klaster)
    ) {
      jawabanSesi2[akt.no] = 6; // Kuat
    } else {
      jawabanSesi2[akt.no] = 4; // Netral
    }
  });

  return { jawabanSesi1, jawabanSesi2 };
}