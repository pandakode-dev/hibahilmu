"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Sparkles,
  X,
} from "lucide-react";
import {
  KATALOG_FITUR_HIBAHILMU_IOT,
  TUR_SPOTLIGHT_TAB_1_STUDIO,
  TUR_SPOTLIGHT_TAB_2_AKADEMI,
} from "./hibahIlmuGuideCatalogData";

// Pencari elemen DOM di layar agar Spotlight bisa menyorot bagian mana saja dari Gambar 1–5
function cariElemenTargetDiLayar(kataKunciList: string[]): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const kandidatTags = Array.from(
    document.querySelectorAll("div, section, h2, h3, h4, span, button")
  ) as HTMLElement[];

  for (const kw of kataKunciList) {
    const kwLower = kw.toLowerCase();
    for (const el of kandidatTags) {
      if (el.closest("[data-tour-overlay='true']")) continue;

      const teksLangsung = (el.textContent || "").trim().toLowerCase();
      if (teksLangsung.includes(kwLower) && teksLangsung.length < 750) {
        const cardContainer =
          (el.closest(
            ".rounded-3xl, .rounded-2xl, .rounded-xl"
          ) as HTMLElement | null) || el;
        const rect = cardContainer.getBoundingClientRect();
        if (rect.width > 110 && rect.height > 32 && rect.height < 1100) {
          return cardContainer;
        }
      }
    }
  }
  return null;
}

export const HibahIlmuIotGuideBannerAndModal: React.FC = () => {
  const [bukaModalPanduan, setBukaModalPanduan] = useState<boolean>(false);
  const [bukaTurSpotlight, setBukaTurSpotlight] = useState<boolean>(false);
  const [modeTabTur, setModeTabTur] = useState<"tab1_studio" | "tab2_akademi">(
    "tab1_studio"
  );
  const [indeksTur, setIndeksTur] = useState<number>(0);
  const [filterKategori, setFilterKategori] = useState<string>("Semua");

  const [kotakSorot, setKotakSorot] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const daftarLangkahAktif =
    modeTabTur === "tab1_studio"
      ? TUR_SPOTLIGHT_TAB_1_STUDIO
      : TUR_SPOTLIGHT_TAB_2_AKADEMI;

  const langkahSaatIni =
    daftarLangkahAktif[indeksTur] || daftarLangkahAktif[0];

  const mulaiTurKontekstual = (
    paksaMode?: "tab1_studio" | "tab2_akademi"
  ) => {
    if (paksaMode) {
      setModeTabTur(paksaMode);
    } else if (typeof document !== "undefined") {
      const adaAkademiDiLayar = Boolean(
        cariElemenTargetDiLayar([
          "Akademi IoT HibahIlmu",
          "1. Periksa Semua Kaki & Jalankan",
        ])
      );
      setModeTabTur(adaAkademiDiLayar ? "tab2_akademi" : "tab1_studio");
    }
    setIndeksTur(0);
    setBukaTurSpotlight(true);
  };

  const sinkronkanSorotanElemen = useCallback(
    (lakukanScroll: boolean) => {
      if (!bukaTurSpotlight || !langkahSaatIni) return;
      const el = cariElemenTargetDiLayar(langkahSaatIni.kataKunciElemenDom);
      if (!el) {
        setKotakSorot(null);
        return;
      }

      if (lakukanScroll) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const hitungUlangRect = () => {
        const r = el.getBoundingClientRect();
        const pad = 8;
        setKotakSorot({
          top: Math.max(8, r.top - pad),
          left: Math.max(8, r.left - pad),
          width: Math.min(window.innerWidth - 16, r.width + pad * 2),
          height: Math.min(window.innerHeight - 16, r.height + pad * 2),
        });
      };

      hitungUlangRect();
      const t1 = setTimeout(hitungUlangRect, 350);
      const t2 = setTimeout(hitungUlangRect, 650);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    [bukaTurSpotlight, langkahSaatIni]
  );

  useEffect(() => {
    if (!bukaTurSpotlight) return;
    sinkronkanSorotanElemen(true);

    const onUpdatePosisi = () => sinkronkanSorotanElemen(false);
    window.addEventListener("scroll", onUpdatePosisi, { passive: true });
    window.addEventListener("resize", onUpdatePosisi);
    return () => {
      window.removeEventListener("scroll", onUpdatePosisi);
      window.removeEventListener("resize", onUpdatePosisi);
    };
  }, [bukaTurSpotlight, indeksTur, modeTabTur, sinkronkanSorotanElemen]);

  const sorotFiturDariKatalog = (kataKunciDom: string[]) => {
    setBukaModalPanduan(false);
    setTimeout(() => {
      const el = cariElemenTargetDiLayar(kataKunciDom);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add(
          "ring-4",
          "ring-amber-400",
          "animate-pulse",
          "transition-all"
        );
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-amber-400", "animate-pulse");
        }, 4500);
      }
    }, 200);
  };

  const daftarFiturTampil = KATALOG_FITUR_HIBAHILMU_IOT.filter(
    (f) => filterKategori === "Semua" || f.kategori === filterKategori
  );

  let popoverTop = 110;
  let popoverLeft = 24;
  let panahDiAtas = true;

  if (typeof window !== "undefined" && kotakSorot) {
    const tinggiPopoverEstimasi = 255;
    const ruangDiBawah =
      window.innerHeight - (kotakSorot.top + kotakSorot.height);

    if (ruangDiBawah >= tinggiPopoverEstimasi + 16) {
      popoverTop = kotakSorot.top + kotakSorot.height + 14;
      panahDiAtas = true;
    } else if (kotakSorot.top >= tinggiPopoverEstimasi + 16) {
      popoverTop = Math.max(14, kotakSorot.top - tinggiPopoverEstimasi - 14);
      panahDiAtas = false;
    } else {
      popoverTop = Math.max(
        18,
        Math.min(window.innerHeight - 275, kotakSorot.top + 20)
      );
      panahDiAtas = true;
    }

    popoverLeft = Math.max(
      16,
      Math.min(
        window.innerWidth - 450,
        kotakSorot.left + Math.min(50, kotakSorot.width / 6)
      )
    );
  }

  return (
    <>
      {/* BANNER HIGHLIGHT BERKEDIP DI ATAS SIMULATOR */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-black animate-bounce shrink-0 shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase animate-pulse">
                ✨ PANDUAN LENGKAP SELURUH BAGIAN SIMULATOR (11 AREA STUDIO &amp; 8 AREA AKADEMI)
              </span>
              <span className="text-xs font-bold text-emerald-300">
                Kanvas • Inspector • Multi-MCU • MQTT • 16 Widget Blynk • HP Android • AIoT
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Jelajahi Setiap Tombol &amp; Panel dengan Tur Sorotan Berkedip (Spotlight Coachmark)
            </h3>
            <p className="text-xs text-slate-300">
              Klik tombol di kanan untuk menyorot dan mengedipkan satu per satu bagian (mulai dari Warna Kabel, Inspector Ruangan, Konverter MicroPython, 16 Widget Blynk, hingga Chaos Mesh &amp; Checklist Kode)!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => mulaiTurKontekstual("tab1_studio")}
            className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xl ring-4 ring-amber-400/30 animate-pulse"
          >
            <Crosshair className="w-4 h-4" /> 🎯 Tur Sorot Tab 1 Studio (11 Bagian)
          </button>

          <button
            type="button"
            onClick={() => mulaiTurKontekstual("tab2_akademi")}
            className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xl"
          >
            <Crosshair className="w-4 h-4" /> 🎓 Tur Sorot Tab 2 Akademi (8 Bagian)
          </button>

          <button
            type="button"
            onClick={() => setBukaModalPanduan(true)}
            className="flex-1 sm:flex-initial px-3.5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xl"
          >
            <BookOpen className="w-4 h-4" /> 📖 Katalog Penjelasan Semua Bagian
          </button>
        </div>
      </div>

      {/* OVERLAY SPOTLIGHT COACHMARK KEKINIAN DI SEKITAR AREA TARGET */}
      {bukaTurSpotlight && (
        <div
          data-tour-overlay="true"
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {kotakSorot ? (
            <div
              style={{
                position: "fixed",
                top: kotakSorot.top,
                left: kotakSorot.left,
                width: kotakSorot.width,
                height: kotakSorot.height,
                boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.78)",
              }}
              className="rounded-3xl border-4 border-amber-400 ring-8 ring-emerald-400/40 animate-pulse transition-all duration-300 pointer-events-none"
            >
              <div className="absolute -top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 👇 AREA YANG SEDANG DIJELASKAN ({langkahSaatIni.badgeArea})
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 bg-slate-950/75" />
          )}

          <div
            style={{
              position: "fixed",
              top: popoverTop,
              left: popoverLeft,
            }}
            className="w-[92vw] max-w-[440px] bg-slate-900/95 backdrop-blur-md border-2 border-emerald-400 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-3.5 pointer-events-auto transition-all duration-300"
          >
            {kotakSorot && (
              <div
                className={`w-4 h-4 bg-slate-900 border-emerald-400 transform rotate-45 absolute left-10 ${
                  panahDiAtas
                    ? "-top-2.5 border-l-2 border-t-2"
                    : "-bottom-2.5 border-r-2 border-b-2"
                }`}
              />
            )}

            <div className="flex justify-between items-center gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setModeTabTur("tab1_studio");
                    setIndeksTur(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                    modeTabTur === "tab1_studio"
                      ? "bg-emerald-400 text-slate-950 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🛠️ Tab 1 Studio (11 Bagian)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModeTabTur("tab2_akademi");
                    setIndeksTur(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
                    modeTabTur === "tab2_akademi"
                      ? "bg-amber-400 text-slate-950 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🎓 Tab 2 Akademi (8 Bagian)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBukaTurSpotlight(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black text-amber-300">
                <span>{langkahSaatIni.badgeArea}</span>
                <span>
                  BAGIAN {indeksTur + 1} DARI {daftarLangkahAktif.length}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {langkahSaatIni.judul}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {langkahSaatIni.isi}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-[11px] text-emerald-300">
                💡 <strong>Tips Praktis:</strong> {langkahSaatIni.tipsPraktis}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                disabled={indeksTur === 0}
                onClick={() => setIndeksTur((i) => Math.max(0, i - 1))}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>

              <div className="flex gap-1 overflow-x-auto max-w-[160px] py-1">
                {daftarLangkahAktif.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndeksTur(i)}
                    className={`h-2 rounded-full cursor-pointer transition-all shrink-0 ${
                      i === indeksTur
                        ? "w-5 bg-amber-400"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              {indeksTur < daftarLangkahAktif.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setIndeksTur((i) => i + 1)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
                >
                  Bagian Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBukaTurSpotlight(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Selesai!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL KATALOG PENJELASAN LENGKAP SEMUA BAGIAN */}
      {bukaModalPanduan && (
        <div
          data-tour-overlay="true"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-slate-900 border-2 border-emerald-400 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                    ENSIKLOPEDIA LENGKAP HIBAHILMU IOT SIMULATOR
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                    Klik &quot;Sorot &amp; Kedipkan Bagian Ini&quot; untuk Melompat ke Lokasinya!
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Penjelasan Detail Seluruh Bagian Studio Kanvas, Inspector, Multi-MCU, Blynk &amp; Akademi
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setBukaModalPanduan(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {[
                "Semua",
                "Studio Kanvas & Inspector (Tab 1)",
                "Multi-MCU IDE & Konverter Kode",
                "Server MQTT, Blynk & HP Android",
                "Akademi, Instrumen Lab & AIoT (Tab 2)",
              ].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setFilterKategori(kat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    filterKategori === kat
                      ? "bg-emerald-400 text-slate-950 shadow"
                      : "bg-slate-950 text-slate-300 border border-slate-800"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {daftarFiturTampil.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 ${item.warnaaksen} space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-bold text-sky-300">
                        {item.kategori}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">
                      {item.judulFitur}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.deskripsiLengkap}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-xs">
                      <div className="font-bold text-amber-300">
                        👉 Cara Menggunakan Bagian Ini:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-200 text-[11px]">
                        {item.caraPakaiSingkat.map((langkah, idx) => (
                          <li key={idx}>{langkah}</li>
                        ))}
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        sorotFiturDariKatalog(item.kataKunciTargetDom)
                      }
                      className="w-full py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/50 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <Crosshair className="w-3.5 h-3.5" /> 🎯 Sorot &amp; Kedipkan Bagian Ini di Layar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};