// app/components/simulator/wokwiDocxReportGenerator.ts
// Zero-Dependency Native OpenXML (.docx) Generator — Kompatibel penuh dengan TypeScript 5.7+ & Next.js 16

import {
  BlueprintMultiPinLevel,
  ExtendedLessonStepIoT,
} from "./wokwiAcademyBlueprints";
import {
  HasilUkurMultimeter,
  ProfilKonsumsiDayaBaterai,
} from "./wokwiLabInstrumentsEngine";
import { HasilUjiSkenarioTestbench } from "./WokwiDebuggerAndTestbenchPanel";

function escapeXml(teks: string): string {
  return (teks || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function crc32(buf: Uint8Array): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
    }
  }
  return (~c) >>> 0;
}

function buatZipDocxBlob(files: { name: string; content: string }[]): Blob {
  const encoder = new TextEncoder();
  const fileEntries = files.map((f) => {
    const nameBytes = encoder.encode(f.name);
    const dataBytes = encoder.encode(f.content);
    const crc = crc32(dataBytes);
    return { nameBytes, dataBytes, crc, offset: 0 };
  });

  let offset = 0;
  const localHeaders: Uint8Array[] = [];

  for (const entry of fileEntries) {
    entry.offset = offset;
    const header = new Uint8Array(30 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, entry.crc, true);
    view.setUint32(18, entry.dataBytes.length, true);
    view.setUint32(22, entry.dataBytes.length, true);
    view.setUint16(26, entry.nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(entry.nameBytes, 30);

    localHeaders.push(header);
    localHeaders.push(entry.dataBytes);
    offset += header.length + entry.dataBytes.length;
  }

  const centralDirectoryStart = offset;
  const centralHeaders: Uint8Array[] = [];

  for (const entry of fileEntries) {
    const cd = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(cd.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.dataBytes.length, true);
    view.setUint32(24, entry.dataBytes.length, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    cd.set(entry.nameBytes, 46);

    centralHeaders.push(cd);
    offset += cd.length;
  }

  const centralDirectorySize = offset - centralDirectoryStart;
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, fileEntries.length, true);
  eocdView.setUint16(10, fileEntries.length, true);
  eocdView.setUint32(12, centralDirectorySize, true);
  eocdView.setUint32(16, centralDirectoryStart, true);
  eocdView.setUint16(20, 0, true);

  const semuaChunks = [
    ...localHeaders,
    ...centralHeaders,
    eocd,
  ] as unknown as BlobPart[];

  return new Blob(semuaChunks, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function wParagraf(
  teks: string,
  opsi?: {
    bold?: boolean;
    italic?: boolean;
    sizeHalfPt?: number;
    align?: "center" | "left";
    font?: string;
    colorHex?: string;
  }
): string {
  const sz = opsi?.sizeHalfPt || 22;
  const font = opsi?.font || "Calibri";
  const color = opsi?.colorHex || "111827";
  const jc = opsi?.align === "center" ? `<w:jc w:val="center"/>` : "";
  const b = opsi?.bold ? `<w:b/>` : "";
  const i = opsi?.italic ? `<w:i/>` : "";

  return `<w:p>
    <w:pPr>${jc}<w:spacing w:after="100"/></w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${font}" w:hAnsi="${font}"/>
        ${b}${i}
        <w:color w:val="${color}"/>
        <w:sz w:val="${sz}"/>
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(teks)}</w:t>
    </w:r>
  </w:p>`;
}

function wBarisTabel(kolom: string[], isHeader = false): string {
  const cells = kolom
    .map(
      (isi) => `<w:tc>
      <w:tcPr>
        <w:tcBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
        </w:tcBorders>
        ${
          isHeader
            ? `<w:shd w:val="clear" w:color="auto" w:fill="E2E8F0"/>`
            : ""
        }
      </w:tcPr>
      ${wParagraf(isi, { bold: isHeader, sizeHalfPt: 20 })}
    </w:tc>`
    )
    .join("");
  return `<w:tr>${cells}</w:tr>`;
}

export async function unduhLaporanPraktikumDocx({
  materi,
  blueprint,
  bahasa,
  modeBelajar,
  kodeProgram,
  outputSerial,
  multimeter,
  profilBaterai,
  hasilTestbench,
}: {
  materi: ExtendedLessonStepIoT;
  blueprint: BlueprintMultiPinLevel;
  bahasa: "cpp" | "micropython";
  modeBelajar: string;
  kodeProgram: string;
  outputSerial: string;
  multimeter: HasilUkurMultimeter;
  profilBaterai: ProfilKonsumsiDayaBaterai;
  hasilTestbench: HasilUjiSkenarioTestbench[];
}) {
  const tanggalSekarang = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const rowsPinoutXml =
    blueprint.sambunganWajibList.length > 0
      ? blueprint.sambunganWajibList
          .map((w, idx) =>
            wBarisTabel([
              String(idx + 1),
              w.labelPinAsal,
              w.labelPinTujuan,
              w.keteranganJalur,
            ])
          )
          .join("")
      : wBarisTabel([
          "1",
          "GPIO 2 (Internal)",
          "On-Board LED / Wi-Fi",
          "Mode Standalone 1-Board ESP32 (Tanpa Kabel Luar)",
        ]);

  const barisKodeXml = (kodeProgram || "")
    .split("\n")
    .map((line, i) =>
      wParagraf(`${String(i + 1).padStart(2, "0")} | ${line}`, {
        font: "Courier New",
        sizeHalfPt: 18,
        colorHex: "065F46",
      })
    )
    .join("");

  const barisSerialXml = (outputSerial || "")
    .split("\n")
    .map((line) =>
      wParagraf(line, {
        font: "Courier New",
        sizeHalfPt: 18,
        colorHex: "1E293B",
      })
    )
    .join("");

  const barisTestbenchXml =
    hasilTestbench.length > 0
      ? hasilTestbench
          .map((t) =>
            wParagraf(
              `[Skenario #${t.nomorSkenario} - ${
                t.lulus ? "LULUS" : "GAGAL"
              }] ${t.namaSkenario}: Input (${t.kondisiInput}) -> Output (${
                t.responDiharapkan
              })`,
              { bold: true, sizeHalfPt: 20 }
            )
          )
          .join("")
      : wParagraf("Pengujian dilakukan secara interaktif di atas kanvas.", {
          sizeHalfPt: 20,
        });

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${wParagraf("LAPORAN RESMI PRAKTIKUM APLIKASI IOT & MIKROKONTROLER", {
      bold: true,
      sizeHalfPt: 28,
      align: "center",
      colorHex: "0F172A",
    })}
    ${wParagraf(
      `Laboratorium Virtual HibahIlmu — Level ${materi.level}: ${materi.judulMateri}`,
      { italic: true, sizeHalfPt: 22, align: "center", colorHex: "334155" }
    )}
    ${wParagraf(
      "----------------------------------------------------------------------------------------------------",
      { align: "center", colorHex: "94A3B8" }
    )}
    ${wParagraf(`Nama Mahasiswa   : Muhammad Saputra`, {
      bold: true,
      sizeHalfPt: 22,
    })}
    ${wParagraf(`NIM / Kelas            : 2556102007 / 25 MTTK A`, {
      bold: true,
      sizeHalfPt: 22,
    })}
    ${wParagraf(`Tanggal Praktikum : ${tanggalSekarang}`, { sizeHalfPt: 22 })}
    ${wParagraf(
      `Bahasa & Mode      : ${
        bahasa === "micropython"
          ? "MicroPython (main.py)"
          : "C++ Arduino (sketch.ino)"
      } — ${
        modeBelajar === "latihan_mandiri"
          ? "Mode Ujian Latihan Mandiri (Pin Baru)"
          : "Mode Terpandu"
      }`,
      { sizeHalfPt: 22 }
    )}

    ${wParagraf("I. TUJUAN & DASAR TEORI RANGKAIAN", {
      bold: true,
      sizeHalfPt: 24,
      colorHex: "0284C7",
    })}
    ${wParagraf(`Tujuan Praktikum: ${materi.tujuanBelajar}`, {
      sizeHalfPt: 21,
    })}
    ${wParagraf(
      `Prinsip Kerja & Aliran Arus: ${blueprint.analogiMudahPaham}`,
      { sizeHalfPt: 21 }
    )}

    ${wParagraf(
      `II. TABEL KONFIGURASI PINOUT (${
        1 + blueprint.slotPeriferalList.length
      } KOMPONEN & ${blueprint.sambunganWajibList.length} JALUR KABEL)`,
      { bold: true, sizeHalfPt: 24, colorHex: "0284C7" }
    )}
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
      </w:tblPr>
      ${wBarisTabel(
        [
          "No",
          "Pin Asal (MCU)",
          "Pin Tujuan (Periferal)",
          "Keterangan Jalur Kabel",
        ],
        true
      )}
      ${rowsPinoutXml}
    </w:tbl>

    ${wParagraf(
      "III. HASIL PENGUKURAN MULTIMETER DIGITAL & PROFIL DAYA BATERAI 18650",
      { bold: true, sizeHalfPt: 24, colorHex: "0284C7" }
    )}
    ${wParagraf(
      `• Tegangan Terukur (${
        multimeter.pinProbeMerah
      }): ${multimeter.teganganTerukurVolt.toFixed(
        2
      )} Volt DC | Arus: ${multimeter.arusTerukurMa.toFixed(
        2
      )} mA | Hambatan Resistor: ${multimeter.hambatanTerukurOhm} Ohm`,
      { sizeHalfPt: 21 }
    )}
    ${wParagraf(
      `• Sinyal Osiloskop PWM: Duty Cycle ${multimeter.dutyCyclePersen}% pada Frekuensi ${multimeter.frekuensiPwmHz} Hz`,
      { sizeHalfPt: 21 }
    )}
    ${wParagraf(
      `• Konsumsi Arus Node: ${profilBaterai.totalArusMa} mA (${profilBaterai.statusEfisiensi}) -> Estimasi Masa Pakai Baterai 2500 mAh: ${profilBaterai.estimasiTahanHari} Hari (${profilBaterai.estimasiTahanJam} Jam)`,
      { sizeHalfPt: 21 }
    )}

    ${wParagraf(
      `IV. LISTING KODE PROGRAM (${
        bahasa === "micropython" ? "main.py" : "sketch.ino"
      })`,
      { bold: true, sizeHalfPt: 24, colorHex: "0284C7" }
    )}
    ${barisKodeXml}

    ${wParagraf("V. LOG SERIAL MONITOR & HASIL AUTOMATED TESTBENCH", {
      bold: true,
      sizeHalfPt: 24,
      colorHex: "0284C7",
    })}
    ${barisSerialXml}
    ${barisTestbenchXml}
    <w:sectPr/>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const blob = buatZipDocxBlob([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: relsXml },
    { name: "word/document.xml", content: documentXml },
  ]);

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Laporan_Praktikum_IoT_Level_${materi.level}_Muhammad_Saputra_2556102007.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}