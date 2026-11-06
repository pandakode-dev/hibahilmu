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

export function gambarIlustrasiBukuMewarnai(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  tipe: MisiKanvasId
) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2.6;
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
    // Garis Bukit & Tanah
    ctx.beginPath();
    ctx.moveTo(0, 215);
    ctx.quadraticCurveTo(140, 195, 290, 215);
    ctx.quadraticCurveTo(420, 228, w, 210);
    ctx.stroke();

    // Gunung Kembar di Belakang
    ctx.beginPath();
    ctx.moveTo(20, 210);
    ctx.lineTo(115, 95);
    ctx.lineTo(205, 210);
    ctx.moveTo(165, 165);
    ctx.lineTo(255, 75);
    ctx.lineTo(355, 215);
    ctx.stroke();

    // Matahari Bersinar Tersenyum
    ctx.beginPath();
    ctx.arc(62, 52, 24, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI * 2 * i) / 12;
      ctx.beginPath();
      ctx.moveTo(62 + Math.cos(a) * 29, 52 + Math.sin(a) * 29);
      ctx.lineTo(62 + Math.cos(a) * 38, 52 + Math.sin(a) * 38);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(54, 48, 2.5, 0, Math.PI * 2);
    ctx.arc(70, 48, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(62, 54, 9, 0.2, Math.PI - 0.2);
    ctx.stroke();

    gambarAwan(320, 48, 0.95);
    gambarAwan(445, 38, 0.75);

    // Rumah Utama Lengkap dengan Cerobong Asap, Genteng, Jendela Berbingkai & Pintu
    ctx.strokeRect(235, 68, 22, 35); // Cerobong
    ctx.beginPath();
    ctx.moveTo(140, 125);
    ctx.lineTo(215, 58);
    ctx.lineTo(290, 125);
    ctx.closePath();
    ctx.stroke();
    // Garis Hiasan Atap
    ctx.beginPath();
    ctx.moveTo(156, 112);
    ctx.lineTo(274, 112);
    ctx.stroke();

    // Dinding Rumah
    ctx.strokeRect(158, 125, 114, 90);
    // Pintu Lengkung & Gagang
    ctx.beginPath();
    ctx.moveTo(196, 215);
    ctx.lineTo(196, 165);
    ctx.arc(214, 165, 18, Math.PI, 0, false);
    ctx.lineTo(232, 215);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(225, 190, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Jendela Kiri & Kanan
    ctx.strokeRect(166, 142, 22, 24);
    ctx.beginPath();
    ctx.moveTo(177, 142);
    ctx.lineTo(177, 166);
    ctx.moveTo(166, 154);
    ctx.lineTo(188, 154);
    ctx.stroke();

    ctx.strokeRect(242, 142, 22, 24);
    ctx.beginPath();
    ctx.moveTo(253, 142);
    ctx.lineTo(253, 166);
    ctx.moveTo(242, 154);
    ctx.lineTo(264, 154);
    ctx.stroke();

    // Pohon Rindang Berbuah Apel di Kanan
    ctx.beginPath();
    ctx.moveTo(415, 212);
    ctx.quadraticCurveTo(422, 170, 418, 135);
    ctx.lineTo(442, 135);
    ctx.quadraticCurveTo(438, 170, 446, 212);
    ctx.stroke();

    // Mahkota Daun Pohon Rindang
    const daunCenters = [
      [430, 95, 36],
      [398, 112, 28],
      [462, 112, 28],
      [412, 75, 26],
      [448, 75, 26],
    ];
    daunCenters.forEach(([dx, dy, dr]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.stroke();
    });
    // Buah-buah di pohon
    [
      [415, 95],
      [445, 92],
      [428, 115],
      [395, 115],
      [462, 115],
    ].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Pagar Taman Kecil di Kiri Rumah
    for (let px = 40; px <= 136; px += 24) {
      ctx.beginPath();
      ctx.moveTo(px, 212);
      ctx.lineTo(px, 182);
      ctx.lineTo(px + 8, 172);
      ctx.lineTo(px + 16, 182);
      ctx.lineTo(px + 16, 212);
      ctx.stroke();
    }
  } else if (tipe === "roket_robot") {
    // Planet Saturnus Bercincin di Kiri Atas
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

    // ROKET ANTARIKSA DETAIL DI TENGAH-KIRI
    ctx.beginPath();
    ctx.moveTo(215, 32); // Ujung kerucut roket
    ctx.quadraticCurveTo(255, 75, 250, 155);
    ctx.lineTo(180, 155);
    ctx.quadraticCurveTo(175, 75, 215, 32);
    ctx.stroke();

    // Garis Kerucut Hidung Roket
    ctx.beginPath();
    ctx.moveTo(192, 68);
    ctx.quadraticCurveTo(215, 76, 238, 68);
    ctx.stroke();

    // Jendela Bulat Astronot Berlapis
    ctx.beginPath();
    ctx.arc(215, 105, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(215, 105, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Sirip Kiri & Kanan Roket
    ctx.beginPath();
    ctx.moveTo(180, 122);
    ctx.quadraticCurveTo(148, 142, 152, 175);
    ctx.lineTo(180, 155);
    ctx.moveTo(250, 122);
    ctx.quadraticCurveTo(282, 142, 278, 175);
    ctx.lineTo(250, 155);
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
    ctx.stroke();

    // ROBOT PINTAR RAMAH DI KANAN
    // Antena Kepala
    ctx.beginPath();
    ctx.moveTo(395, 58);
    ctx.lineTo(395, 36);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(395, 30, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Kepala Robot Rounded
    ctx.strokeRect(355, 58, 80, 56);
    ctx.strokeRect(345, 74, 10, 24); // Telinga kiri
    ctx.strokeRect(435, 74, 10, 24); // Telinga kanan
    // Mata & Senyum Robot
    ctx.beginPath();
    ctx.arc(376, 80, 9, 0, Math.PI * 2);
    ctx.arc(414, 80, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(374, 96, 42, 10);

    // Badan & Panel Dada Robot
    ctx.strokeRect(345, 120, 100, 78);
    ctx.strokeRect(362, 134, 66, 36);
    // Tombol-tombol dada robot
    ctx.beginPath();
    ctx.arc(376, 182, 5, 0, Math.PI * 2);
    ctx.arc(395, 182, 5, 0, Math.PI * 2);
    ctx.arc(414, 182, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Lengan & Kaki Robot
    ctx.strokeRect(318, 126, 22, 55);
    ctx.strokeRect(450, 126, 22, 55);
    ctx.strokeRect(362, 198, 24, 24);
    ctx.strokeRect(404, 198, 24, 24);
  } else if (tipe === "taman_kupu") {
    // KUPU-KUPU RAJA BESAR DENGAN SAYAP BERPOLA INDAH DI TENGAH ATAS
    const bx = 250;
    const by = 102;
    // Badan Kupu-Kupu
    ctx.beginPath();
    ctx.arc(bx, by - 36, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(bx, by + 6, 8, 36, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Antena Melengkung
    ctx.beginPath();
    ctx.moveTo(bx - 4, by - 44);
    ctx.quadraticCurveTo(bx - 22, by - 72, bx - 34, by - 64);
    ctx.moveTo(bx + 4, by - 44);
    ctx.quadraticCurveTo(bx + 22, by - 72, bx + 34, by - 64);
    ctx.stroke();

    // Sayap Atas Kiri & Kanan
    ctx.beginPath();
    ctx.moveTo(bx - 7, by - 22);
    ctx.bezierCurveTo(bx - 95, by - 88, bx - 125, by - 5, bx - 8, by + 4);
    ctx.moveTo(bx + 7, by - 22);
    ctx.bezierCurveTo(bx + 95, by - 88, bx + 125, by - 5, bx + 8, by + 4);
    ctx.stroke();

    // Sayap Bawah Kiri & Kanan
    ctx.beginPath();
    ctx.moveTo(bx - 8, by + 4);
    ctx.bezierCurveTo(bx - 95, by + 12, bx - 75, by + 78, bx - 6, by + 35);
    ctx.moveTo(bx + 8, by + 4);
    ctx.bezierCurveTo(bx + 95, by + 12, bx + 75, by + 78, bx + 6, by + 35);
    ctx.stroke();

    // Pola Bulatan Cantik di Dalam Sayap Kupu-Kupu
    [
      [bx - 52, by - 26, 15],
      [bx + 52, by - 26, 15],
      [bx - 72, by - 10, 8],
      [bx + 72, by - 10, 8],
      [bx - 44, by + 28, 12],
      [bx + 44, by + 28, 12],
    ].forEach(([cx, cy, cr]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 2 BUNGA BESAR MEKAR DI KIRI & KANAN BAWAH
    const gambarBungaMekar = (fx: number, fy: number) => {
      // Batang & Daun
      ctx.beginPath();
      ctx.moveTo(fx, fy + 18);
      ctx.lineTo(fx, 225);
      ctx.moveTo(fx, 195);
      ctx.quadraticCurveTo(fx - 28, 180, fx - 32, 198);
      ctx.quadraticCurveTo(fx - 15, 210, fx, 195);
      ctx.moveTo(fx, 185);
      ctx.quadraticCurveTo(fx + 28, 170, fx + 32, 188);
      ctx.quadraticCurveTo(fx + 15, 200, fx, 185);
      ctx.stroke();

      // 6 Kelopak Bunga
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        const px = fx + Math.cos(a) * 24;
        const py = fy + Math.sin(a) * 24;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Inti Bunga Tersenyum
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(fx, fy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    gambarBungaMekar(90, 140);
    gambarBungaMekar(435, 140);
  } else if (tipe === "dino_purba") {
    // DINOSAURUS BRACHIOSAURUS RAMAH & GUNUNG BERAPI PURBA
    ctx.beginPath();
    ctx.moveTo(0, 212);
    ctx.lineTo(w, 212);
    ctx.stroke();

    // Tubuh & Leher Panjang Dinosaurus
    ctx.beginPath();
    ctx.moveTo(115, 165); // Pangkal leher
    ctx.quadraticCurveTo(95, 95, 110, 52); // Leher naik
    ctx.quadraticCurveTo(115, 32, 142, 36); // Kepala atas
    ctx.quadraticCurveTo(162, 42, 158, 58); // Moncong ramah
    ctx.quadraticCurveTo(142, 66, 130, 65); // Dagu
    ctx.quadraticCurveTo(128, 115, 148, 145); // Leher bawah
    ctx.quadraticCurveTo(215, 135, 255, 165); // Punggung bulat
    ctx.quadraticCurveTo(295, 190, 335, 198); // Ekor memanjang
    ctx.quadraticCurveTo(290, 208, 252, 192);
    ctx.lineTo(252, 212);
    ctx.lineTo(226, 212);
    ctx.lineTo(226, 190);
    ctx.lineTo(162, 190);
    ctx.lineTo(162, 212);
    ctx.lineTo(134, 212);
    ctx.lineTo(134, 185);
    ctx.quadraticCurveTo(115, 180, 115, 165);
    ctx.stroke();

    // Mata, Senyum & Bercak Punggung Dino
    ctx.beginPath();
    ctx.arc(138, 46, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(146, 54, 8, 0.2, 1.8);
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

    // Gunung Berapi Purba & Awan Asap di Kanan
    ctx.beginPath();
    ctx.moveTo(355, 212);
    ctx.lineTo(412, 98);
    ctx.lineTo(458, 98);
    ctx.lineTo(515, 212);
    ctx.stroke();
    // Lelehan Lava di Puncak Gunung
    ctx.beginPath();
    ctx.moveTo(412, 98);
    ctx.quadraticCurveTo(422, 125, 430, 112);
    ctx.quadraticCurveTo(440, 132, 448, 110);
    ctx.quadraticCurveTo(454, 122, 458, 98);
    ctx.stroke();
    gambarAwan(415, 56, 0.9);
  } else if (tipe === "bawah_laut") {
    // Gelombang Permukaan Air Laut di Atas
    ctx.beginPath();
    for (let x = 0; x <= w; x += 45) {
      ctx.moveTo(x, 28);
      ctx.quadraticCurveTo(x + 22, 14, x + 45, 28);
    }
    ctx.stroke();

    // KAPAL SELAM PENJELAJAH DI KIRI ATAS
    ctx.beginPath();
    ctx.ellipse(145, 95, 68, 32, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Menara & Periskop Kapal Selam
    ctx.strokeRect(128, 48, 34, 16);
    ctx.beginPath();
    ctx.moveTo(145, 48);
    ctx.lineTo(145, 32);
    ctx.lineTo(160, 32);
    ctx.stroke();
    // 3 Jendela Bulat Kapal Selam
    [112, 145, 178].forEach((jx) => {
      ctx.beginPath();
      ctx.arc(jx, 95, 10, 0, Math.PI * 2);
      ctx.stroke();
    });

    // IKAN TROPIS BESAR BERSISIK DI KANAN
    ctx.beginPath();
    ctx.ellipse(375, 125, 58, 38, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Ekor Ikan
    ctx.beginPath();
    ctx.moveTo(432, 125);
    ctx.lineTo(475, 92);
    ctx.quadraticCurveTo(462, 125, 475, 158);
    ctx.closePath();
    ctx.stroke();
    // Mata, Mulut & Belang Badan Ikan
    ctx.beginPath();
    ctx.arc(336, 115, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(362, 90);
    ctx.quadraticCurveTo(352, 125, 362, 160);
    ctx.moveTo(392, 90);
    ctx.quadraticCurveTo(382, 125, 392, 160);
    ctx.stroke();

    // Bintang Laut & Rumput Laut di Dasar
    gambarBintang(255, 198, 24, 10);
    [60, 85, 465, 490].forEach((rx) => {
      ctx.beginPath();
      ctx.moveTo(rx, 228);
      ctx.quadraticCurveTo(rx - 15, 195, rx + 5, 170);
      ctx.quadraticCurveTo(rx + 18, 150, rx, 130);
      ctx.stroke();
    });
  } else if (tipe === "masjid_indah") {
    // MASJID MEGAH BERKUBAH UTAMA & 2 MENARA
    ctx.beginPath();
    ctx.moveTo(20, 218);
    ctx.lineTo(w - 20, 218);
    ctx.stroke();

    // Kubah Utama Tengah
    ctx.beginPath();
    ctx.moveTo(190, 125);
    ctx.bezierCurveTo(190, 55, 350, 55, 350, 125);
    ctx.closePath();
    ctx.stroke();
    // Bulan Sabit di Puncak Kubah
    ctx.beginPath();
    ctx.arc(270, 46, 10, 0.3, Math.PI * 1.6);
    ctx.stroke();

    // Bangunan Utama Masjid & Pintu Lengkung Islami
    ctx.strokeRect(175, 125, 190, 93);
    ctx.beginPath();
    ctx.moveTo(242, 218);
    ctx.lineTo(242, 168);
    ctx.quadraticCurveTo(270, 142, 298, 168);
    ctx.lineTo(298, 218);
    ctx.stroke();

    // Jendela Lengkung Kiri & Kanan
    [205, 335].forEach((wx) => {
      ctx.beginPath();
      ctx.moveTo(wx - 12, 192);
      ctx.lineTo(wx - 12, 162);
      ctx.arc(wx, 162, 12, Math.PI, 0, false);
      ctx.lineTo(wx + 12, 192);
      ctx.closePath();
      ctx.stroke();
    });

    // Menara Kembar Kiri & Kanan
    [115, 425].forEach((mx) => {
      ctx.strokeRect(mx - 18, 82, 36, 136);
      ctx.beginPath();
      ctx.moveTo(mx - 22, 82);
      ctx.quadraticCurveTo(mx, 42, mx + 22, 82);
      ctx.closePath();
      ctx.stroke();
    });

    gambarBintang(60, 52, 14, 6);
    gambarBintang(485, 52, 14, 6);
  } else if (tipe === "panggung_musik") {
    // TUTS PIANO KLASIK DI BAGIAN BAWAH
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

    // GITAR AKUSTIK & NOTASI NADA MUSIK DI ATAS
    ctx.beginPath();
    ctx.arc(215, 85, 32, 0, Math.PI * 2);
    ctx.arc(265, 85, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(289, 77, 75, 16);
    ctx.beginPath();
    ctx.arc(235, 85, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Not Balok Melayang
    [
      [110, 72],
      [425, 78],
    ].forEach(([nx, ny]) => {
      ctx.beginPath();
      ctx.arc(nx, ny, 9, 0, Math.PI * 2);
      ctx.moveTo(nx + 9, ny);
      ctx.lineTo(nx + 9, ny - 32);
      ctx.lineTo(nx + 28, ny - 26);
      ctx.stroke();
    });
  } else {
    // KANVAS IMAJINASI BEBAS DENGAN BINGKAI BINTANG SUDUT
    gambarBintang(36, 36, 16, 7);
    gambarBintang(w - 36, 36, 16, 7);
    gambarBintang(36, h - 36, 16, 7);
    gambarBintang(w - 36, h - 36, 16, 7);
    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(
      "✨ Kanvas Bebas: Gambar & Warnai Imajinasi Terbaikmu di Sini! ✨",
      w / 2,
      28
    );
  }

  ctx.restore();
}