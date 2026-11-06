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
  skorKompositML: number; // Skor presisi hasil Machine Learning (Z-Score + Cross-Session Tie-Breaker)
  zScore: number;
  persentaseKekuatan: number;
  konsistensiInternal: number; // 0..100%
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
  kuadran: "Sweet Spot" | "Hidden Gem" | "Aspirational" | "Low Priority";
}

export interface CareerAndMajorRecommendation {
  bidang: string;
  ikon: string;
  jurusanSekolahKuliah: string[];
  profesiMasaDepan: string[];
  alasanKecocokan: string;
  skorMatch: number; // 0..99%
}

export interface ClusterRadarScore {
  kode: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
  nama: string;
  rataPSP: number; // 0..100
  rataPSS: number; // 0..100
  skorGabungan: number; // 0..100
}

export interface PsychometricAnalyticsML {
  skorValiditasKonsistensi: number; // 0..100%
  labelValiditas: "Sangat Akurat & Konsisten" | "Cukup Konsisten" | "Perlu Evaluasi Ulang";
  indeksDiferensiasi: number; // Ketajaman pembedaan bakat
  archetypePersona: {
    judul: string;
    subjudul: string;
    motoHidup: string;
    gayaBelajarEfektif: string[];
    partnerKolaborasiIdeal: string;
  };
  kuadranAktivitas: {
    sweetSpots: ScmActivityEvaluation[]; // PSP Tinggi & PSS Tinggi
    hiddenGems: ScmActivityEvaluation[]; // PSP Tinggi & PSS Rendah
    aspirational: ScmActivityEvaluation[]; // PSP Rendah & PSS Tinggi
  };
  radar8Klaster: ClusterRadarScore[];
  rekomendasiJurusanDanKarier: CareerAndMajorRecommendation[];
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
  analyticsML?: PsychometricAnalyticsML;
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

// ============================================================================
// DATABASE REKOMENDASI JURUSAN PENDIDIKAN & KARIER MASA DEPAN (2026-2035)
// ============================================================================
const KATALOG_KARIER_MASA_DEPAN: {
  bidang: string;
  ikon: string;
  klasterUtama: ("N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T")[];
  bakatKunci: string[];
  jurusanSekolahKuliah: string[];
  profesiMasaDepan: string[];
  alasanTemplate: string;
}[] = [
  {
    bidang: "Teknologi, AI, Software & Data Science",
    ikon: "💻",
    klasterUtama: ["T", "R", "Gi"],
    bakatKunci: ["ideation", "learner", "analytical", "intellection", "restorative", "strategic"],
    jurusanSekolahKuliah: [
      "Teknik Informatika / Ilmu Komputer",
      "Sains Data (Data Science) & AI",
      "Sistem Informasi & Keamanan Siber",
      "Teknik Elektro, Robotika & IoT",
    ],
    profesiMasaDepan: [
      "Full-Stack & Mobile App Developer",
      "AI / Machine Learning Engineer",
      "IoT Systems & Embedded Architect",
      "Data Scientist & Cybersecurity Specialist",
    ],
    alasanTemplate:
      "Kombinasi daya pikir logis, keingintahuan belajar yang tinggi, dan kemampuan memecahkan masalah membuatmu sangat unggul di dunia teknologi dan rekayasa masa depan.",
  },
  {
    bidang: "Pendidikan, Psikologi, HR & Pengembangan Manusia",
    ikon: "🎓",
    klasterUtama: ["N", "S"],
    bakatKunci: ["developer", "empathy", "communication", "individualization", "belief", "relator"],
    jurusanSekolahKuliah: [
      "Psikologi & Bimbingan Konseling",
      "Manajemen SDM (Human Capital) & Organisasi",
      "Teknologi Pendidikan & Keguruan",
      "Ilmu Komunikasi & Pengembangan Masyarakat",
    ],
    profesiMasaDepan: [
      "People & Organizational Development (OD) Specialist",
      "HR Business Partner (HRBP) & Talent Acquisition",
      "Dosen / Pendidik Inovatif & EdTech Creator",
      "Psikolog / Konselor Karier & Keluarga",
    ],
    alasanTemplate:
      "Kamu punya ketulusan hati, kesabaran membimbing, dan kepekaan membaca potensi unik tiap orang sehingga sangat cocok menjadi penggerak kemajuan sumber daya manusia.",
  },
  {
    bidang: "Kreatif Digital, Desain, Media & Komunikasi Publik",
    ikon: "🎨",
    klasterUtama: ["Gi", "N"],
    bakatKunci: ["ideation", "communication", "woo", "futuristic", "maximizer", "positivity"],
    jurusanSekolahKuliah: [
      "Desain Komunikasi Visual (DKV) & UI/UX",
      "Ilmu Komunikasi, PR & Digital Media",
      "Arsitektur & Desain Produk Industri",
      "Film, Animasi & Industri Kreatif",
    ],
    profesiMasaDepan: [
      "UI/UX Product Designer & Creative Director",
      "Digital Content Creator & Brand Strategist",
      "Public Relations (PR) & Corporate Ambassador",
      "Jurnalis Multimedia & Penulis Buku/Skenario",
    ],
    alasanTemplate:
      "Imajinasi kreatifmu yang kaya dipadukan dengan kepiawaian merangkai kata dan mencairkan suasana membuat karyamu mudah memikat hati banyak orang.",
  },
  {
    bidang: "Bisnis, Kewirausahaan, Manajemen & Kepemimpinan",
    ikon: "🚀",
    klasterUtama: ["H", "Gi", "T"],
    bakatKunci: ["strategic", "command", "activator", "woo", "competition", "arranger", "self_assurance"],
    jurusanSekolahKuliah: [
      "Manajemen Bisnis & Kewirausahaan (Entrepreneurship)",
      "Bisnis Digital & E-Commerce",
      "Manajemen Rantai Pasok & Logistik",
      "Hubungan Internasional & Hukum Bisnis",
    ],
    profesiMasaDepan: [
      "Tech Startup Founder / Entrepreneur",
      "Product Manager & Business Development Lead",
      "Project Manager & Operations Director",
      "Negotiator & Marketing Strategist",
    ],
    alasanTemplate:
      "Ketajaman melihat peluang strategis, keberanian mengambil keputusan, dan keluwesan mengatur tim menjadikanmu pemimpin bisnis dan organisasi yang tangguh.",
  },
  {
    bidang: "Keuangan, Audit, Hukum & Tata Kelola Kepatuhan",
    ikon: "⚖️",
    klasterUtama: ["T", "E", "R"],
    bakatKunci: ["consistency", "deliberative", "discipline", "responsibility", "analytical", "focus"],
    jurusanSekolahKuliah: [
      "Akuntansi, Keuangan & Perbankan Syariah/Umum",
      "Ilmu Hukum & Regulasi Korporat",
      "Administrasi Publik & Manajemen Risiko",
      "Statistika & Aktuaria",
    ],
    profesiMasaDepan: [
      "Financial Analyst, Treasurer & Auditor",
      "Risk Management & Compliance Officer",
      "Legal Specialist & Policy Administrator",
      "Quality Assurance (QA) & Safety Inspector",
    ],
    alasanTemplate:
      "Ketelitianmu menjaga aturan, kehati-hatian menakar risiko, serta integritas memegang amanah membuatmu sangat dipercaya mengelola keuangan dan kepatuhan standar.",
  },
  {
    bidang: "Kesehatan, Medis, Lingkungan & Sosial Kemanusiaan",
    ikon: "🩺",
    klasterUtama: ["S", "R", "Te"],
    bakatKunci: ["belief", "empathy", "restorative", "responsibility", "connectedness", "adaptability"],
    jurusanSekolahKuliah: [
      "Kedokteran, Keperawatan & Kesehatan Masyarakat",
      "Farmasi, Gizi & Biomedis",
      "Teknik Lingkungan, Kehutanan & Agroteknologi",
      "Kesejahteraan Sosial & Manajemen Bencana",
    ],
    profesiMasaDepan: [
      "Tenaga Medis, Dokter & Terapis Kesehatan",
      "Environmental & Sustainability Specialist (ESG)",
      "Social Enterprise Leader & Humanitarian Worker",
      "Peneliti Bioteknologi & Ketahanan Pangan",
    ],
    alasanTemplate:
      "Jiwa pengabdianmu yang tulus dan keahlian mendiagnosa serta memulihkan masalah menjadikanmu pahlawan di bidang kesehatan dan kelestarian lingkungan.",
  },
];

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

  // ==========================================================================
  // 1. IPSATIVE Z-SCORE NORMALIZATION & CROSS-SESSION TIE-BREAKER (ML ENGINE)
  // ==========================================================================
  // Hitung rata-rata (mean) dan simpangan baku (stdDev) seluruh 170 jawaban Sesi 1
  const semuaNilaiS1: number[] = [];
  for (let i = 1; i <= 170; i++) {
    semuaNilaiS1.push(jawabanSesi1[i] ?? 4);
  }
  const meanS1 =
    semuaNilaiS1.reduce((acc, v) => acc + v, 0) / semuaNilaiS1.length;
  const varianceS1 =
    semuaNilaiS1.reduce((acc, v) => acc + Math.pow(v - meanS1, 2), 0) /
    semuaNilaiS1.length;
  const stdDevS1 = Math.max(0.35, Math.sqrt(varianceS1));

  // Hitung dukungan Sesi 2 terhadap tiap bakat (sebagai Tie-Breaker ilmiah)
  const dukunganSesi2PerBakat = new Map<string, { sum: number; count: number }>();
  SOAL_SESI_2_114_SCM.forEach((akt) => {
    const valS2 = jawabanSesi2[akt.no] ?? 4;
    akt.bobotBakatIds.forEach((bId) => {
      const prev = dukunganSesi2PerBakat.get(bId) || { sum: 0, count: 0 };
      dukunganSesi2PerBakat.set(bId, {
        sum: prev.sum + valS2,
        count: prev.count + 1,
      });
    });
  });

  let totalKonsistensiInternal = 0;

  const skorPerSlot = DAFTAR_34_BAKAT.map((bakat) => {
    const butirNilai: number[] = [];
    // Bobot sedikit lebih tinggi untuk soal di paruh akhir ketika peserta semakin menghayati
    const bobotButir = [0.96, 0.98, 1.0, 1.02, 1.04];
    let totalSkorMentah = 0;
    let totalSkorBerbobot = 0;

    for (let k = 0; k < 5; k++) {
      const nomorSoal = bakat.slotIndex + 1 + k * 34;
      const nilai = jawabanSesi1[nomorSoal] ?? 4;
      butirNilai.push(nilai);
      totalSkorMentah += nilai;
      totalSkorBerbobot += nilai * bobotButir[k];
    }

    // Hitung konsistensi internal 5 soal dalam 1 bakat (semakin kecil selisihnya, semakin konsisten)
    const rataButir = totalSkorMentah / 5;
    const varButir =
      butirNilai.reduce((acc, v) => acc + Math.pow(v - rataButir, 2), 0) / 5;
    const konsistensiBakat = Math.max(
      45,
      Math.min(100, Math.round((1 - Math.sqrt(varButir) / 2.5) * 100))
    );
    totalKonsistensiInternal += konsistensiBakat;

    // Hitung Z-Score bakat terhadap profil individu
    const zScore = Number(((rataButir - meanS1) / stdDevS1).toFixed(3));

    // Tie-breaker dari Sesi 2 (porsi 8% agar urutan 34 bakat tetap 92% murni Sesi 1 tapi bebas angka seri/tie)
    const infoS2 = dukunganSesi2PerBakat.get(bakat.id);
    const rataS2 = infoS2 ? infoS2.sum / infoS2.count : 4;
    const bonusTieBreakerS2 = (rataS2 / 7) * 2.2;

    const skorKompositML = Number(
      (totalSkorBerbobot + zScore * 1.5 + bonusTieBreakerS2).toFixed(3)
    );

    return {
      bakat,
      skorMentah: totalSkorMentah,
      skorKompositML,
      zScore,
      konsistensiInternal: konsistensiBakat,
    };
  });

  skorPerSlot.sort((a, b) => b.skorKompositML - a.skorKompositML);

  const mapPeringkatBakat = new Map<string, number>();

  const urutan34Bakat: RankedTalentItem[] = skorPerSlot.map((item, idx) => {
    const peringkat = idx + 1;
    mapPeringkatBakat.set(item.bakat.id, peringkat);

    const persentaseKekuatan = Math.min(
      99,
      Math.max(12, Math.round(((item.skorMentah - 5) / 25) * 100))
    );

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
      skorKompositML: item.skorKompositML,
      zScore: item.zScore,
      persentaseKekuatan,
      konsistensiInternal: item.konsistensiInternal,
      kategoriKekuatan,
      warnaHex,
    };
  });

  const bakatUtama1_7 = urutan34Bakat.slice(0, 7);
  const bakatPendukung8_14 = urutan34Bakat.slice(7, 14);
  const bakatLemah28_34 = urutan34Bakat.slice(27, 34);

  // ==========================================================================
  // 2. ANALISIS DOMINASI 4 DOMAIN & ARCHETYPE PERSONA
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

  const kamusArtiDomain: Record<TalentDomain, string> = {
    Thinking:
      "merancang ide kreatif, menganalisis masalah secara mendalam, dan cepat mempelajari ilmu baru",
    Relating:
      "membangun persahabatan yang hangat, peka membantu sesama, dan menjaga kekompakan tim",
    Striving:
      "bekerja keras dengan penuh tanggung jawab, disiplin menjaga aturan, dan menuntaskan target",
    Influencing:
      "berbicara memikat di depan umum, menyemangati orang lain, dan berani memimpin perubahan",
  };

  const profilProduktivitasNarasi = `Dari 14 Bakat Terkuat (7 Bakat Utama & 7 Bakat Pendukung), gaya belajar dan berkarya alami ${namaPeserta} paling bersinar di kelompok ${duaDomainDominan[0]} (${urutDomain[0][1]} bakat) serta ${duaDomainDominan[1]} (${urutDomain[1][1]} bakat). Artinya, ${namaPeserta} punya keunggulan alami dalam ${kamusArtiDomain[duaDomainDominan[0]]}, sekaligus hebat dalam ${kamusArtiDomain[duaDomainDominan[1]]}.`;

  // ==========================================================================
  // 3. HITUNG PETA 114 AKTIVITAS SCM & KUADRAN KESELARASAN (PSP vs PSS)
  // ==========================================================================
  const evaluasiMentah114 = SOAL_SESI_2_114_SCM.map((akt) => {
    const skorPSS = jawabanSesi2[akt.no] ?? 4;

    let totalBobotPSP = 0;
    let totalWeight = 0;
    akt.bobotBakatIds.forEach((bId, idx) => {
      const rank = mapPeringkatBakat.get(bId) ?? 17;
      // Bakat utama di urutan awal daftar bobotBakatIds diberi penekanan lebih tinggi
      const w = idx === 0 ? 1.35 : idx === 1 ? 1.15 : 0.95;
      const poinRank = ((35 - rank) / 34) * 7;
      totalBobotPSP += poinRank * w;
      totalWeight += w;
    });
    const rataPSP = totalWeight > 0 ? totalBobotPSP / totalWeight : 4;

    const skorKombinasi = Math.round(
      ((rataPSP * 0.62 + skorPSS * 0.38) / 7) * 100
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
    (item) => {
      const warnaPSP = tentukanWarnaLimaTingkat(
        rankMapPSP.get(item.no) || 57,
        114
      );
      const warnaPSS = tentukanWarnaLimaTingkat(
        rankMapPSS.get(item.no) || 57,
        114
      );

      const pspKuat = warnaPSP === "Merah" || warnaPSP === "Kuning";
      const pssKuat = warnaPSS === "Merah" || warnaPSS === "Kuning";

      let kuadran: ScmActivityEvaluation["kuadran"] = "Low Priority";
      if (pspKuat && pssKuat) kuadran = "Sweet Spot";
      else if (pspKuat && !pssKuat) kuadran = "Hidden Gem";
      else if (!pspKuat && pssKuat) kuadran = "Aspirational";

      return {
        no: item.no,
        kodeAktivitas: item.kodeAktivitas,
        klaster: item.klaster,
        namaKlaster: item.namaKlaster,
        deskripsiSingkat: item.deskripsiSingkat,
        typology: item.typology,
        skorPSP: item.skorPSP,
        skorPSS: item.skorPSS,
        skorKombinasi: item.skorKombinasi,
        warnaPSP,
        warnaPSS,
        kuadran,
      };
    }
  );

  const prioritas14Aktivitas = [...petaLengkap114SCM]
    .sort((a, b) => b.skorKombinasi - a.skorKombinasi)
    .slice(0, 14);

  // ==========================================================================
  // 4. HITUNG SKOR RADAR 8 KLASTER SCM (N, H, S, Gi, Te, E, R, T)
  // ==========================================================================
  const daftarKodeKlaster: {
    kode: "N" | "H" | "S" | "Gi" | "Te" | "E" | "R" | "T";
    nama: string;
  }[] = [
    { kode: "N", nama: "Networking" },
    { kode: "H", nama: "Headman" },
    { kode: "S", nama: "Serving" },
    { kode: "Gi", nama: "Generating Idea" },
    { kode: "Te", nama: "Technical" },
    { kode: "E", nama: "Elementary" },
    { kode: "R", nama: "Reasoning" },
    { kode: "T", nama: "Thinking" },
  ];

  const radar8Klaster: ClusterRadarScore[] = daftarKodeKlaster.map((kl) => {
    const items = petaLengkap114SCM.filter((a) => a.klaster === kl.kode);
    const avgPSP =
      items.reduce((acc, x) => acc + (x.skorPSP / 7) * 100, 0) /
      Math.max(1, items.length);
    const avgPSS =
      items.reduce((acc, x) => acc + (x.skorPSS / 7) * 100, 0) /
      Math.max(1, items.length);
    const gabungan = avgPSP * 0.6 + avgPSS * 0.4;
    return {
      kode: kl.kode,
      nama: kl.nama,
      rataPSP: Math.round(avgPSP),
      rataPSS: Math.round(avgPSS),
      skorGabungan: Math.round(gabungan),
    };
  });

  // ==========================================================================
  // 5. HITUNG TOP 5 PERSONAL BRANDING & REKOMENDASI JURUSAN / KARIER
  // ==========================================================================
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

  // Hitung kecocokan untuk 6 Bidang Jurusan Kuliah & Karier Masa Depan
  const mapKlasterScore = new Map<string, number>();
  radar8Klaster.forEach((r) => mapKlasterScore.set(r.kode, r.skorGabungan));

  const rekomendasiJurusanDanKarier: CareerAndMajorRecommendation[] =
    KATALOG_KARIER_MASA_DEPAN.map((kat) => {
      let poinBakat = 0;
      kat.bakatKunci.forEach((bId) => {
        const rank = mapPeringkatBakat.get(bId) ?? 17;
        poinBakat += ((35 - rank) / 34) * 100;
      });
      const rataBakat = poinBakat / kat.bakatKunci.length;

      let poinKlaster = 0;
      kat.klasterUtama.forEach((kKode) => {
        poinKlaster += mapKlasterScore.get(kKode) ?? 65;
      });
      const rataKlaster = poinKlaster / kat.klasterUtama.length;

      const skorMatch = Math.min(
        98,
        Math.max(58, Math.round(rataBakat * 0.65 + rataKlaster * 0.35))
      );

      return {
        bidang: kat.bidang,
        ikon: kat.ikon,
        jurusanSekolahKuliah: kat.jurusanSekolahKuliah,
        profesiMasaDepan: kat.profesiMasaDepan,
        alasanKecocokan: kat.alasanTemplate,
        skorMatch,
      };
    }).sort((a, b) => b.skorMatch - a.skorMatch);

  // ==========================================================================
  // 6. ANALITIK VALIDITAS ML & ARCHETYPE PERSONA
  // ==========================================================================
  const skorValiditasKonsistensi = Math.round(totalKonsistensiInternal / 34);
  const labelValiditas: PsychometricAnalyticsML["labelValiditas"] =
    skorValiditasKonsistensi >= 82
      ? "Sangat Akurat & Konsisten"
      : skorValiditasKonsistensi >= 68
      ? "Cukup Konsisten"
      : "Perlu Evaluasi Ulang";

  const indeksDiferensiasi = Math.min(
    99,
    Math.max(55, Math.round(stdDevS1 * 62))
  );

  const d1 = duaDomainDominan[0];
  const d2 = duaDomainDominan[1];
  const gayaBelajarPerDomain: Record<TalentDomain, string[]> = {
    Thinking: [
      "Belajar lewat peta konsep (Mind-Mapping), eksplorasi riset, dan bedah cara kerja sistem",
      "Menyediakan waktu tenang untuk membaca mendalam dan mengutak-atik proyek baru",
    ],
    Relating: [
      "Belajar kelompok (Peer-Learning) dan berdiskusi hangat bersama sahabat dekat",
      "Memahami materi lebih cepat dengan cara mengajarkannya kembali kepada teman (Tutor Sebaya)",
    ],
    Striving: [
      "Menggunakan daftar target harian (Checklist) dan jadwal belajar bertahap yang jelas",
      "Langsung mempraktikkan materi pelajaran hingga menghasilkan karya nyata",
    ],
    Influencing: [
      "Belajar lewat presentasi aktif, debat positif, simulasi peran, dan kompetisi",
      "Memimpin proyek kelompok dan mempresentasikan ide di depan kelas/forum",
    ],
  };

  const partnerPerDomainLemah = bakatLemah28_34
    .slice(0, 3)
    .map((b) => `${b.nama} (${b.julukanRemaja})`)
    .join(", ");

  const analyticsML: PsychometricAnalyticsML = {
    skorValiditasKonsistensi,
    labelValiditas,
    indeksDiferensiasi,
    archetypePersona: {
      judul: `The ${top5PersonalBranding[0]?.nama || "CREATOR"} & ${
        top5PersonalBranding[1]?.nama || "MOTIVATOR"
      } Innovator`,
      subjudul: `Kombinasi Kekuatan ${d1} & ${d2} — Dipimpin oleh Bakat #1 ${bakatUtama1_7[0]?.nama} (${bakatUtama1_7[0]?.julukanRemaja})`,
      motoHidup: `"Melahirkan gagasan cerdas, menebar manfaat tulus bagi sesama, dan menjaga kepercayaan dengan karya terbaik."`,
      gayaBelajarEfektif: [
        ...gayaBelajarPerDomain[d1],
        ...gayaBelajarPerDomain[d2],
      ],
      partnerKolaborasiIdeal: `Dalam kerja kelompok atau membangun bisnis, kamu akan sangat terbantu jika berpasangan dengan teman yang kuat di bidang ${partnerPerDomainLemah} agar kalian saling melengkapi 100%!`,
    },
    kuadranAktivitas: {
      sweetSpots: petaLengkap114SCM
        .filter((x) => x.kuadran === "Sweet Spot")
        .sort((a, b) => b.skorKombinasi - a.skorKombinasi)
        .slice(0, 8),
      hiddenGems: petaLengkap114SCM
        .filter((x) => x.kuadran === "Hidden Gem")
        .sort((a, b) => b.skorPSP - a.skorPSP)
        .slice(0, 6),
      aspirational: petaLengkap114SCM
        .filter((x) => x.kuadran === "Aspirational")
        .sort((a, b) => b.skorPSS - a.skorPSS)
        .slice(0, 6),
    },
    radar8Klaster,
    rekomendasiJurusanDanKarier,
  };

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
    analyticsML,
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