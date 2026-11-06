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
  peringkat: number;
  skorMentah: number;
  persentaseKekuatan: number;
  kategoriKekuatan:
    | "Bakat Utama (1-7)"
    | "Bakat Pendukung (8-14)"
    | "Bakat Netral (15-21)"
    | "Bakat Rendah (22-27)"
    | "Bakat Lemah (28-34)";
  warnaHex: string;
}

export interface ScmActivityEvaluation {
  no: number;
  kodeAktivitas: string;
  klaster: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
  namaKlaster: string;
  deskripsiSingkat: string;
  typology: string;
  skorPSP: number;
  skorPSS: number;
  skorKombinasi: number;
  warnaPSP: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam";
  warnaPSS: "Merah" | "Kuning" | "Putih" | "Abu" | "Hitam";
}

export interface HasilLengkapTalentMapping {
  idHasil: string;
  pemilikUserId: string;
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
  pemilikUserId?: string;
  namaPeserta: string;
  emailPeserta: string;
  instansiPeserta?: string;
  jabatanAtauKelas?: string;
  jawabanSesi1: Record<number, number>;
  jawabanSesi2: Record<number, number>;
}): HasilLengkapTalentMapping {
  const {
    pemilikUserId = "guest",
    namaPeserta,
    emailPeserta,
    instansiPeserta = "HibahIlmu Indonesia",
    jabatanAtauKelas = "Pelajar / Mahasiswa / Umum",
    jawabanSesi1,
    jawabanSesi2,
  } = params;

  // 1. HITUNG SKOR 34 BAKAT DARI 170 SOAL SESI 1
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

  skorPerSlot.sort((a, b) => b.skorMentah - a.skorMentah);

  const mapPeringkatBakat = new Map<string, number>();

  const urutan34Bakat: RankedTalentItem[] = skorPerSlot.map((item, idx) => {
    const peringkat = idx + 1;
    mapPeringkatBakat.set(item.bakat.id, peringkat);

    const persentaseKekuatan = Math.round(((item.skorMentah - 5) / 25) * 100);

    let kategoriKekuatan: RankedTalentItem["kategoriKekuatan"] =
      "Bakat Netral (15-21)";
    let warnaHex = "#f8fafc";

    if (peringkat <= 7) {
      kategoriKekuatan = "Bakat Utama (1-7)";
      warnaHex = "#e11d48";
    } else if (peringkat <= 14) {
      kategoriKekuatan = "Bakat Pendukung (8-14)";
      warnaHex = "#f59e0b";
    } else if (peringkat <= 21) {
      kategoriKekuatan = "Bakat Netral (15-21)";
      warnaHex = "#e2e8f0";
    } else if (peringkat <= 27) {
      kategoriKekuatan = "Bakat Rendah (22-27)";
      warnaHex = "#64748b";
    } else {
      kategoriKekuatan = "Bakat Lemah (28-34)";
      warnaHex = "#0f172a";
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

  // 2. ANALISIS DOMINASI 4 DOMAIN PADA 14 BAKAT TERKUAT
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

  const kamusArtiDomain: Record<TalentDomain, string> = {
    Thinking: "merancang ide kreatif, menganalisis masalah, dan terus belajar hal baru",
    Relating: "membangun persahabatan yang hangat, peka membantu teman, dan bekerja sama dalam tim",
    Striving: "bekerja keras dengan penuh tanggung jawab, menjaga aturan, dan menuntaskan target",
    Influencing: "berbicara di depan umum, menyemangati orang lain, dan memimpin perubahan",
  };

  const profilProduktivitasNarasi = `Dari 14 Bakat Terkuat (7 Bakat Utama & 7 Bakat Pendukung), gaya belajar dan berkarya alami ${namaPeserta} paling bersinar di kelompok ${duaDomainDominan[0]} (${urutDomain[0][1]} bakat) serta ${duaDomainDominan[1]} (${urutDomain[1][1]} bakat). Artinya, ${namaPeserta} punya keunggulan alami dalam ${kamusArtiDomain[duaDomainDominan[0]]}, sekaligus hebat dalam ${kamusArtiDomain[duaDomainDominan[1]]}.`;

  // 3. HITUNG PETA 114 AKTIVITAS SCM (PSP DARI SESI 1 & PSS DARI SESI 2)
  const evaluasiMentah114 = SOAL_SESI_2_114_SCM.map((akt) => {
    const skorPSS = jawabanSesi2[akt.no] ?? 4;

    let totalBobotPSP = 0;
    akt.bobotBakatIds.forEach((bId) => {
      const rank = mapPeringkatBakat.get(bId) ?? 17;
      const poinRank = ((35 - rank) / 34) * 7;
      totalBobotPSP += poinRank;
    });
    const rataPSP =
      akt.bobotBakatIds.length > 0
        ? totalBobotPSP / akt.bobotBakatIds.length
        : 4;

    const skorKombinasi = Math.round(
      ((rataPSP * 0.65 + skorPSS * 0.35) / 7) * 100
    );

    return {
      ...akt,
      skorPSP: Number(rataPSP.toFixed(2)),
      skorPSS,
      skorKombinasi,
    };
  });

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

  const prioritas14Aktivitas = [...petaLengkap114SCM]
    .sort((a, b) => b.skorKombinasi - a.skorKombinasi)
    .slice(0, 14);

  // 4. HITUNG TOP 5 PERSONAL BRANDING
  const skorPerTypology = new Map<string, { total: number; count: number }>();
  petaLengkap114SCM.forEach((akt) => {
    const prev = skorPerTypology.get(akt.typology) || { total: 0, count: 0 };
    skorPerTypology.set(akt.typology, {
      total: prev.total + akt.skorKombinasi,
      count: prev.count + 1,
    });
  });

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

  const top3NamaBakat = bakatUtama1_7
    .slice(0, 3)
    .map((b) => `${b.nama} (${b.julukanRemaja})`)
    .join(", ");
  const top3Branding = top5PersonalBranding
    .slice(0, 3)
    .map((r) => `${r.nama} (${r.julukan})`)
    .join(", ");
  const top4Aktivitas = prioritas14Aktivitas
    .slice(0, 4)
    .map((a) => a.kodeAktivitas)
    .join(", ");

  return {
    idHasil: `TM-${emailPeserta.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now()}`,
    pemilikUserId,
    namaPeserta,
    emailPeserta: emailPeserta.trim().toLowerCase(),
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
      talentAcquisitionFit: `Sangat cocok berperan sebagai ${top3Branding}. Kekuatan alaminya paling menonjol pada ${top3NamaBakat}.`,
      peopleDevelopmentPlan: `Asahlah keterampilan dan ilmu (Skill & Knowledge) pada kegiatan ${top4Aktivitas}. Tidak perlu memaksakan diri pada bakat urutan bawah (${bakatLemah28_34
        .slice(0, 3)
        .map((x) => x.nama)
        .join(", ")}), cukup siasati dengan berkolaborasi bersama teman satu tim.`,
      organizationalPlacement: `Paling berkembang jika ditempatkan di lingkungan belajar/kerja yang memberi ruang untuk kreativitas ide, membimbing sesama, komunikasi aktif, dan kejelasan aturan (${duaDomainDominan[0]} & ${duaDomainDominan[1]}).`,
    },
  };
}

export function buatPresetJawabanMuhammadSaputra(): {
  jawabanSesi1: Record<number, number>;
  jawabanSesi2: Record<number, number>;
} {
  const urutanTargetId = [
    "ideation",
    "developer",
    "consistency",
    "belief",
    "adaptability",
    "woo",
    "communication",
    "strategic",
    "learner",
    "futuristic",
    "intellection",
    "deliberative",
    "responsibility",
    "relator",
    "includer",
    "connectedness",
    "restorative",
    "harmony",
    "self_assurance",
    "input",
    "arranger",
    "maximizer",
    "command",
    "individualization",
    "positivity",
    "empathy",
    "analytical",
    "discipline",
    "context",
    "activator",
    "achiever",
    "significance",
    "focus",
    "competition",
  ];

  const jawabanSesi1: Record<number, number> = {};
  DAFTAR_34_BAKAT.forEach((b) => {
    const rankIndex = urutanTargetId.indexOf(b.id);
    const rank = rankIndex >= 0 ? rankIndex + 1 : 17;
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
      jawabanSesi2[akt.no] = 7;
    } else if (["N", "S", "Gi"].includes(akt.klaster)) {
      jawabanSesi2[akt.no] = 6;
    } else {
      jawabanSesi2[akt.no] = 4;
    }
  });

  return { jawabanSesi1, jawabanSesi2 };
}