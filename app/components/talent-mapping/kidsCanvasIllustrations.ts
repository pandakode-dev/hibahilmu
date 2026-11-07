// app/components/talent-mapping/kidsCanvasIllustrations.ts

export type MisiKanvasId =
  | "rumah_pohon"
  | "roket_robot"
  | "taman_kupu"
  | "dino_purba"
  | "bawah_laut"
  | "masjid_indah"
  | "panggung_musik"
  | "bebas";

export interface MisiKanvasConfig {
  id: MisiKanvasId;
  judul: string;
  sub: string;
  dimensiUtama: string;
  dimensiPendukung: string;
}

export const DAFTAR_8_MISI_KANVAS: MisiKanvasConfig[] = [
  {
    id: "rumah_pohon",
    judul: "🏡 1. Rumah Impian & Pegunungan",
    sub: "Kepekaan ruang, kehangatan keluarga & alam",
    dimensiUtama: "seni",
    dimensiPendukung: "alam",
  },
  {
    id: "roket_robot",
    judul: "🚀 2. Roket Antariksa & Robot",
    sub: "Imajinasi teknologi, sains & logika bentuk",
    dimensiUtama: "logika",
    dimensiPendukung: "mandiri",
  },
  {
    id: "taman_kupu",
    judul: "🦋 3. Kupu-Kupu & Taman Bunga",
    sub: "Ketelitian motorik halus & keindahan warna",
    dimensiUtama: "seni",
    dimensiPendukung: "alam",
  },
  {
    id: "dino_purba",
    judul: "🦕 4. Dinosaurus & Alam Purba",
    sub: "Rasa ingin tahu eksploratif & energi gerak",
    dimensiUtama: "alam",
    dimensiPendukung: "fisik",
  },
  {
    id: "bawah_laut",
    judul: "🐠 5. Petualangan Bawah Laut",
    sub: "Eksplorasi satwa laut, kapal selam & terumbu",
    dimensiUtama: "alam",
    dimensiPendukung: "logika",
  },
  {
    id: "masjid_indah",
    judul: "🕌 6. Masjid Indah & Bulan Bintang",
    sub: "Ketertiban simetri, ketenangan & nilai kebaikan",
    dimensiUtama: "sosial",
    dimensiPendukung: "bahasa",
  },
  {
    id: "panggung_musik",
    judul: "🎸 7. Gitar, Piano & Nada Musik",
    sub: "Ekspresi irama, harmoni & kepercayaan diri",
    dimensiUtama: "musik",
    dimensiPendukung: "bahasa",
  },
  {
    id: "bebas",
    judul: "✨ 8. Kanvas Imajinasi Bebas",
    sub: "Anak bebas menggambar karya orisinalnya sendiri",
    dimensiUtama: "mandiri",
    dimensiPendukung: "seni",
  },
];

// ============================================================================
// ALGORITMA EMBER CAT TUMPAH (FLOOD-FILL) RAMAH TABLET & STYLUS
// ============================================================================
function hexKeRgb(hex: string): [number, number, number] {
  const bersih = hex.replace("#", "").trim();
  const num = parseInt(bersih, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function apakahPikselGarisTepiGelap(r: number, g: number, b: number): boolean {
  // Garis outline sketsa menggunakan warna gelap (#1e293b / #334155)
  return r < 95 && g < 105 && b < 120;
}

export function isiWarnaCatTumpahFloodFill(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  startX: number,
  startY: number,
  fillHex: string,
  tipeMisi: MisiKanvasId
): boolean {
  const x0 = Math.max(0, Math.min(w - 1, Math.round(startX)));
  const y0 = Math.max(0, Math.min(h - 1, Math.round(startY)));

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const [fillR, fillG, fillB] = hexKeRgb(fillHex);
  const startIdx = (y0 * w + x0) * 4;
  const targetR = data[startIdx];
  const targetG = data[startIdx + 1];
  const targetB = data[startIdx + 2];

  // Jangan tumpahkan cat jika pengguna mengetuk tepat di atas garis batas hitam/gelap
  if (apakahPikselGarisTepiGelap(targetR, targetG, targetB)) {
    return false;
  }

  // Jika warna di titik tersebut sudah sama persis dengan warna cat baru, lewati
  if (
    Math.abs(targetR - fillR) < 8 &&
    Math.abs(targetG - fillG) < 8 &&
    Math.abs(targetB - fillB) < 8
  ) {
    return false;
  }

  const toleransi = 52;
  const cocokDenganWarnaTarget = (idx: number) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (apakahPikselGarisTepiGelap(r, g, b)) return false;
    return (
      Math.abs(r - targetR) <= toleransi &&
      Math.abs(g - targetG) <= toleransi &&
      Math.abs(b - targetB) <= toleransi
    );
  };

  const visited = new Uint8Array(w * h);
  const stackX = new Int32Array(w * h);
  const stackY = new Int32Array(w * h);
  let stackPtr = 0;

  stackX[stackPtr] = x0;
  stackY[stackPtr] = y0;
  stackPtr++;
  visited[y0 * w + x0] = 1;

  while (stackPtr > 0) {
    stackPtr--;
    const cx = stackX[stackPtr];
    const cy = stackY[stackPtr];
    const pIdx = (cy * w + cx) * 4;

    data[pIdx] = fillR;
    data[pIdx + 1] = fillG;
    data[pIdx + 2] = fillB;
    data[pIdx + 3] = 255;

    // Cek 4 tetangga (Kiri, Kanan, Atas, Bawah)
    if (cx > 0) {
      const nPos = cy * w + (cx - 1);
      if (!visited[nPos] && cocokDenganWarnaTarget(nPos * 4)) {
        visited[nPos] = 1;
        stackX[stackPtr] = cx - 1;
        stackY[stackPtr] = cy;
        stackPtr++;
      }
    }
    if (cx < w - 1) {
      const nPos = cy * w + (cx + 1);
      if (!visited[nPos] && cocokDenganWarnaTarget(nPos * 4)) {
        visited[nPos] = 1;
        stackX[stackPtr] = cx + 1;
        stackY[stackPtr] = cy;
        stackPtr++;
      }
    }
    if (cy > 0) {
      const nPos = (cy - 1) * w + cx;
      if (!visited[nPos] && cocokDenganWarnaTarget(nPos * 4)) {
        visited[nPos] = 1;
        stackX[stackPtr] = cx;
        stackY[stackPtr] = cy - 1;
        stackPtr++;
      }
    }
    if (cy < h - 1) {
      const nPos = (cy + 1) * w + cx;
      if (!visited[nPos] && cocokDenganWarnaTarget(nPos * 4)) {
        visited[nPos] = 1;
        stackX[stackPtr] = cx;
        stackY[stackPtr] = cy + 1;
        stackPtr++;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  // Gambar ulang garis tepi di atasnya agar outline tetap tajam & rapi setelah dicat!
  gambarIlustrasiBukuMewarnai(ctx, w, h, tipeMisi, true);
  return true;
}

// ============================================================================
// MESIN PENGGAMBAR 8 ILUSTRASI BUKU MEWARNAI ANAK (TERTUTUP RAPI UNTUK CAT)
// ============================================================================
export function gambarIlustrasiBukuMewarnai(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tipe: MisiKanvasId,
  hanyaGarisOutlineTanpaResetPutih = false
) {
  ctx.save();
  if (!hanyaGarisOutlineTanpaResetPutih) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 3.0;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const gambarAwan = (cx: number, cy: number, s = 1) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 16 * s, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(cx + 15 * s, cy - 12 * s, 18 * s, Math.PI * 1.0, Math.PI * 1.85);
    ctx.arc(cx + 36 * s, cy - 8 * s, 16 * s, Math.PI * 1.15, Math.PI * 1.95);
    ctx.arc(cx + 48 * s, cy + 2 * s, 14 * s, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.stroke();
  };

  const gambarBintang = (cx: number, cy: number, rOuter: number, rInner: number) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? rOuter : rInner;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  if (tipe === "rumah_pohon") {
    // Gunung Kembar Tertutup Rapi untuk Dicat
    ctx.beginPath();
    ctx.moveTo(0, 212);
    ctx.lineTo(115, 88);
    ctx.lineTo(225, 212);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(165, 212);
    ctx.lineTo(268, 72);
    ctx.lineTo(385, 212);
    ctx.closePath();
    ctx.stroke();

    // Tanah Rumput Bawah
    ctx.strokeRect(0, 212, w, h - 212);

    // Matahari Bersinar Tersenyum
    ctx.beginPath();
    ctx.arc(62, 52, 24, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12;
      ctx.beginPath();
      ctx.moveTo(62 + Math.cos(a) * 28, 52 + Math.sin(a) * 28);
      ctx.lineTo(62 + Math.cos(a) * 37, 52 + Math.sin(a) * 37);
      ctx.stroke();
    }

    gambarAwan(325, 46, 0.95);
    gambarAwan(445, 38, 0.75);

    // Rumah Utama Lengkap dengan Cerobong Asap, Genteng, Jendela & Pintu
    ctx.strokeRect(235, 68, 22, 42);
    ctx.beginPath();
    ctx.moveTo(140, 125);
    ctx.lineTo(215, 58);
    ctx.lineTo(290, 125);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeRect(158, 125, 114, 87);
    // Pintu Lengkung
    ctx.beginPath();
    ctx.moveTo(196, 212);
    ctx.lineTo(196, 165);
    ctx.arc(214, 165, 18, Math.PI, 0, false);
    ctx.lineTo(232, 212);
    ctx.closePath();
    ctx.stroke();

    // Jendela Kiri & Kanan
    ctx.strokeRect(166, 142, 22, 24);
    ctx.strokeRect(242, 142, 22, 24);

    // Pohon Rindang Berbuah Apel di Kanan
    ctx.strokeRect(418, 132, 24, 80);
    ctx.beginPath();
    ctx.arc(430, 96, 42, 0, Math.PI * 2);
    ctx.stroke();
    [
      [414, 88],
      [446, 88],
      [430, 112],
      [405, 108],
      [454, 108],
    ].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Pagar Taman di Kiri Rumah
    for (let px = 36; px <= 132; px += 24) {
      ctx.strokeRect(px, 178, 16, 34);
    }
  } else if (tipe === "roket_robot") {
    // Planet Saturnus Bercincin
    ctx.beginPath();
    ctx.arc(85, 68, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(85, 68, 52, 12, -0.25, 0, Math.PI * 2);
    ctx.stroke();

    gambarBintang(45, 155, 16, 7);
    gambarBintang(145, 42, 12, 5);
    gambarBintang(485, 52, 18, 8);
    gambarBintang(495, 175, 14, 6);

    // ROKET ANTARIKSA TERTUTUP RAPI UNTUK CAT TUMPAH
    ctx.beginPath();
    ctx.moveTo(215, 32);
    ctx.quadraticCurveTo(255, 75, 250, 155);
    ctx.lineTo(180, 155);
    ctx.quadraticCurveTo(175, 75, 215, 32);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(190, 68);
    ctx.lineTo(240, 68);
    ctx.stroke();

    // Jendela Bulat Astronot
    ctx.beginPath();
    ctx.arc(215, 105, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(215, 105, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Sirip Kiri & Kanan Roket
    ctx.beginPath();
    ctx.moveTo(180, 122);
    ctx.lineTo(150, 172);
    ctx.lineTo(180, 155);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(250, 122);
    ctx.lineTo(280, 172);
    ctx.lineTo(250, 155);
    ctx.closePath();
    ctx.stroke();

    // Semburan Api Roket
    ctx.beginPath();
    ctx.moveTo(192, 155);
    ctx.lineTo(185, 195);
    ctx.lineTo(204, 178);
    ctx.lineTo(215, 215);
    ctx.lineTo(226, 178);
    ctx.lineTo(245, 195);
    ctx.lineTo(238, 155);
    ctx.closePath();
    ctx.stroke();

    // ROBOT PINTAR RAMAH DI KANAN
    ctx.beginPath();
    ctx.moveTo(395, 58);
    ctx.lineTo(395, 36);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(395, 29, 7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(355, 58, 80, 56);
    ctx.strokeRect(343, 74, 12, 24);
    ctx.strokeRect(435, 74, 12, 24);
    ctx.beginPath();
    ctx.arc(376, 80, 9, 0, Math.PI * 2);
    ctx.arc(414, 80, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(374, 96, 42, 10);

    ctx.strokeRect(345, 118, 100, 80);
    ctx.strokeRect(362, 132, 66, 36);
    ctx.beginPath();
    ctx.arc(376, 182, 6, 0, Math.PI * 2);
    ctx.arc(395, 182, 6, 0, Math.PI * 2);
    ctx.arc(414, 182, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeRect(321, 124, 24, 56);
    ctx.strokeRect(445, 124, 24, 56);
    ctx.strokeRect(362, 198, 24, 24);
    ctx.strokeRect(404, 198, 24, 24);
  } else if (tipe === "taman_kupu") {
    const bx = 250;
    const by = 102;
    // Sayap Atas Kiri & Kanan Tertutup
    ctx.beginPath();
    ctx.moveTo(bx - 7, by - 22);
    ctx.bezierCurveTo(bx - 95, by - 88, bx - 125, by - 5, bx - 8, by + 4);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + 7, by - 22);
    ctx.bezierCurveTo(bx + 95, by - 88, bx + 125, by - 5, bx + 8, by + 4);
    ctx.closePath();
    ctx.stroke();

    // Sayap Bawah Kiri & Kanan Tertutup
    ctx.beginPath();
    ctx.moveTo(bx - 8, by + 4);
    ctx.bezierCurveTo(bx - 95, by + 12, bx - 75, by + 78, bx - 6, by + 35);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + 8, by + 4);
    ctx.bezierCurveTo(bx + 95, by + 12, bx + 75, by + 78, bx + 6, by + 35);
    ctx.closePath();
    ctx.stroke();

    // Badan & Kepala Kupu-Kupu
    ctx.beginPath();
    ctx.arc(bx, by - 36, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(bx, by + 6, 8, 36, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pola Bulatan di Dalam Sayap Kupu-Kupu
    [
      [bx - 52, by - 26, 15],
      [bx + 52, by - 26, 15],
      [bx - 44, by + 28, 12],
      [bx + 44, by + 28, 12],
    ].forEach(([cx, cy, cr]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();
    });

    const gambarBungaMekar = (fx: number, fy: number) => {
      ctx.strokeRect(fx - 4, fy + 16, 8, 72);
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        const px = fx + Math.cos(a) * 24;
        const py = fy + Math.sin(a) * 24;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(fx, fy, 15, 0, Math.PI * 2);
      ctx.stroke();
    };

    gambarBungaMekar(90, 145);
    gambarBungaMekar(435, 145);
  } else if (tipe === "dino_purba") {
    ctx.strokeRect(0, 212, w, h - 212);

    // Tubuh Dinosaurus Tertutup Penuh
    ctx.beginPath();
    ctx.moveTo(115, 165);
    ctx.quadraticCurveTo(95, 95, 110, 52);
    ctx.quadraticCurveTo(115, 32, 142, 36);
    ctx.quadraticCurveTo(162, 42, 158, 58);
    ctx.quadraticCurveTo(142, 66, 130, 65);
    ctx.quadraticCurveTo(128, 115, 148, 145);
    ctx.quadraticCurveTo(215, 135, 255, 165);
    ctx.quadraticCurveTo(295, 190, 335, 198);
    ctx.quadraticCurveTo(290, 208, 252, 192);
    ctx.lineTo(252, 212);
    ctx.lineTo(226, 212);
    ctx.lineTo(226, 190);
    ctx.lineTo(162, 190);
    ctx.lineTo(162, 212);
    ctx.lineTo(134, 212);
    ctx.lineTo(134, 185);
    ctx.quadraticCurveTo(115, 180, 115, 165);
    ctx.closePath();
    ctx.stroke();

    [
      [185, 160, 12],
      [215, 164, 15],
      [240, 175, 10],
    ].forEach(([cx, cy, cr]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Gunung Berapi Purba Tertutup
    ctx.beginPath();
    ctx.moveTo(355, 212);
    ctx.lineTo(412, 98);
    ctx.lineTo(458, 98);
    ctx.lineTo(515, 212);
    ctx.closePath();
    ctx.stroke();

    gambarAwan(415, 56, 0.9);
  } else if (tipe === "bawah_laut") {
    // Kapal Selam
    ctx.strokeRect(128, 48, 34, 18);
    ctx.beginPath();
    ctx.ellipse(145, 95, 68, 32, 0, 0, Math.PI * 2);
    ctx.stroke();
    [112, 145, 178].forEach((jx) => {
      ctx.beginPath();
      ctx.arc(jx, 95, 10, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Ikan Tropis Besar
    ctx.beginPath();
    ctx.ellipse(375, 125, 58, 38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(432, 125);
    ctx.lineTo(475, 92);
    ctx.lineTo(475, 158);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(336, 115, 6, 0, Math.PI * 2);
    ctx.stroke();

    gambarBintang(255, 195, 24, 10);
  } else if (tipe === "masjid_indah") {
    ctx.strokeRect(20, 215, w - 40, 18);

    // Kubah Utama Tengah
    ctx.beginPath();
    ctx.moveTo(190, 125);
    ctx.bezierCurveTo(190, 55, 350, 55, 350, 125);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeRect(175, 125, 190, 90);
    ctx.beginPath();
    ctx.moveTo(242, 215);
    ctx.lineTo(242, 168);
    ctx.quadraticCurveTo(270, 142, 298, 168);
    ctx.lineTo(298, 215);
    ctx.closePath();
    ctx.stroke();

    [205, 335].forEach((wx) => {
      ctx.beginPath();
      ctx.moveTo(wx - 12, 192);
      ctx.lineTo(wx - 12, 162);
      ctx.arc(wx, 162, 12, Math.PI, 0, false);
      ctx.lineTo(wx + 12, 192);
      ctx.closePath();
      ctx.stroke();
    });

    [115, 425].forEach((mx) => {
      ctx.strokeRect(mx - 18, 82, 36, 133);
      ctx.beginPath();
      ctx.moveTo(mx - 22, 82);
      ctx.quadraticCurveTo(mx, 42, mx + 22, 82);
      ctx.closePath();
      ctx.stroke();
    });

    gambarBintang(60, 52, 16, 7);
    gambarBintang(485, 52, 16, 7);
  } else if (tipe === "panggung_musik") {
    ctx.strokeRect(95, 145, 350, 72);
    for (let i = 1; i < 10; i++) {
      const tx = 95 + i * 35;
      ctx.beginPath();
      ctx.moveTo(tx, 145);
      ctx.lineTo(tx, 217);
      ctx.stroke();
      if (i % 7 !== 3 && i % 7 !== 0) {
        ctx.strokeRect(tx - 10, 145, 20, 42);
      }
    }

    ctx.beginPath();
    ctx.arc(215, 85, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(265, 85, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(289, 77, 75, 16);
    ctx.beginPath();
    ctx.arc(235, 85, 11, 0, Math.PI * 2);
    ctx.stroke();

    gambarBintang(115, 75, 18, 8);
    gambarBintang(425, 75, 18, 8);
  } else {
    gambarBintang(36, 36, 18, 8);
    gambarBintang(w - 36, 36, 18, 8);
    gambarBintang(36, h - 36, 18, 8);
    gambarBintang(w - 36, h - 36, 18, 8);
  }

  ctx.restore();
}