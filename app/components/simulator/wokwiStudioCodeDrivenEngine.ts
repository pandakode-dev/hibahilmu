// app/components/simulator/wokwiStudioCodeDrivenEngine.ts
import React from "react";
import { Wifi, Radio, Cloud, Cpu, AlertTriangle } from "lucide-react";

export interface StatusEksekusiKodeStudio {
  validSintaksDasar: boolean;
  daftarErrorKompilasi: string[];
  delayMs: number;
  baudRateSerial: number;

  pinOutputTerprogram: number[];
  pinInputTerprogram: number[];
  pinSedangHigh: number[];
  pinSedangLow: number[];
  pinPwmNilai: Record<number, number>;
  pinAnalogDibaca: number[];
  pinServoTerprogram: Record<number, number>;
  pinInterruptTerprogram: number[];

  wifiTerprogram: boolean;
  ssidTertulis: string;

  mqttTerprogram: boolean;
  mqttBrokerHost: string;
  mqttTopicsPublished: { topic: string; payloadExpr: string }[];
  mqttTopicsSubscribed: string[];

  blynkTerprogram: boolean;
  blynkAuthToken: string;
  blynkVirtualWrites: { vPin: string; nilaiExpr: string }[];
  blynkVirtualReads: string[];

  webServerTerprogram: boolean;
  telegramBotTerprogram: boolean;
}

export function analisisKodeStudioLengkap(
  kodeMentah: string
): StatusEksekusiKodeStudio {
  const daftarErrorKompilasi: string[] = [];

  const kode = (kodeMentah || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const adaSetup = /void\s+setup\s*\(\s*\)/.test(kode);
  const adaLoop = /void\s+loop\s*\(\s*\)/.test(kode);
  if (!adaSetup) {
    daftarErrorKompilasi.push(
      "Compile Error: Fungsi utama 'void setup()' tidak ditemukan di dalam program."
    );
  }
  if (!adaLoop) {
    daftarErrorKompilasi.push(
      "Compile Error: Fungsi utama 'void loop()' tidak ditemukan di dalam program."
    );
  }

  const kurungBuka = (kode.match(/\{/g) || []).length;
  const kurungTutup = (kode.match(/\}/g) || []).length;
  if (kurungBuka === 0 || kurungBuka !== kurungTutup) {
    daftarErrorKompilasi.push(
      `Syntax Error: Jumlah kurung kurawal tidak seimbang ('{' = ${kurungBuka}, '}' = ${kurungTutup}).`
    );
  }

  const matchBaud = kode.match(/Serial\.begin\s*\(\s*(\d+)\s*\)/);
  const baudRateSerial = matchBaud ? parseInt(matchBaud[1], 10) : 0;

  const matchDelay = kode.match(/delay\s*\(\s*(\d+)\s*\)/);
  const delayMs = matchDelay ? Math.max(80, parseInt(matchDelay[1], 10)) : 800;

  const petaVariabelPin: Record<string, number> = {};
  const regexDefine = /#define\s+([A-Za-z_][A-Za-z0-9_]*)\s+(\d+)/g;
  let mDef: RegExpExecArray | null;
  while ((mDef = regexDefine.exec(kode)) !== null) {
    petaVariabelPin[mDef[1]] = parseInt(mDef[2], 10);
  }

  const regexConstInt =
    /(?:const\s+)?int\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(\d+)\s*;/g;
  let mInt: RegExpExecArray | null;
  while ((mInt = regexConstInt.exec(kode)) !== null) {
    petaVariabelPin[mInt[1]] = parseInt(mInt[2], 10);
  }

  const resolusiNomorPin = (tokenPin: string): number | null => {
    const t = tokenPin.trim();
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    if (petaVariabelPin[t] !== undefined) return petaVariabelPin[t];
    return null;
  };

  const pinOutputTerprogram: number[] = [];
  const pinInputTerprogram: number[] = [];
  const regexPinMode =
    /pinMode\s*\(\s*([A-Za-z0-9_]+)\s*,\s*(OUTPUT|INPUT|INPUT_PULLUP|INPUT_PULLDOWN)\s*\)/g;
  let mPm: RegExpExecArray | null;
  while ((mPm = regexPinMode.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mPm[1]);
    if (noPin !== null) {
      if (mPm[2] === "OUTPUT") {
        if (!pinOutputTerprogram.includes(noPin))
          pinOutputTerprogram.push(noPin);
      } else {
        if (!pinInputTerprogram.includes(noPin)) pinInputTerprogram.push(noPin);
      }
    }
  }

  const pinSedangHigh: number[] = [];
  const pinSedangLow: number[] = [];
  const regexDw =
    /digitalWrite\s*\(\s*([A-Za-z0-9_]+)\s*,\s*(HIGH|LOW|1|0|true|false)\s*\)/g;
  let mDw: RegExpExecArray | null;
  while ((mDw = regexDw.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mDw[1]);
    if (noPin !== null) {
      const val = mDw[2];
      if (val === "HIGH" || val === "1" || val === "true") {
        if (!pinSedangHigh.includes(noPin)) pinSedangHigh.push(noPin);
      } else {
        if (!pinSedangLow.includes(noPin)) pinSedangLow.push(noPin);
      }
    }
  }

  const pinPwmNilai: Record<number, number> = {};
  const regexAw =
    /analogWrite\s*\(\s*([A-Za-z0-9_]+)\s*,\s*([A-Za-z0-9_]+)\s*\)/g;
  let mAw: RegExpExecArray | null;
  while ((mAw = regexAw.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mAw[1]);
    const nilai = resolusiNomorPin(mAw[2]) ?? 180;
    if (noPin !== null) {
      pinPwmNilai[noPin] = Math.min(255, Math.max(0, nilai));
      if (!pinSedangHigh.includes(noPin) && nilai > 0)
        pinSedangHigh.push(noPin);
    }
  }

  const pinAnalogDibaca: number[] = [];
  const regexAr = /(?:analogRead|digitalRead)\s*\(\s*([A-Za-z0-9_]+)\s*\)/g;
  let mAr: RegExpExecArray | null;
  while ((mAr = regexAr.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mAr[1]);
    if (noPin !== null && !pinAnalogDibaca.includes(noPin)) {
      pinAnalogDibaca.push(noPin);
    }
  }

  const pinServoTerprogram: Record<number, number> = {};
  const regexServoAttach = /\.attach\s*\(\s*([A-Za-z0-9_]+)\s*\)/g;
  let mSa: RegExpExecArray | null;
  const matchSudutServo = kode.match(/\.write\s*\(\s*(\d+)\s*\)/);
  const sudutDefault = matchSudutServo ? parseInt(matchSudutServo[1], 10) : 90;
  while ((mSa = regexServoAttach.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mSa[1]);
    if (noPin !== null) {
      pinServoTerprogram[noPin] = sudutDefault;
    }
  }

  const pinInterruptTerprogram: number[] = [];
  const regexInt =
    /attachInterrupt\s*\(\s*(?:digitalPinToInterrupt\s*\(\s*([A-Za-z0-9_]+)\s*\)|([A-Za-z0-9_]+))/g;
  let mIntr: RegExpExecArray | null;
  while ((mIntr = regexInt.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mIntr[1] || mIntr[2] || "");
    if (noPin !== null && !pinInterruptTerprogram.includes(noPin)) {
      pinInterruptTerprogram.push(noPin);
    }
  }

  const matchWifiBegin = kode.match(
    /WiFi\.begin\s*\(\s*"([^"]+)"|(?:Blynk\.begin\s*\([^,]+,\s*"([^"]+)")/
  );
  const adaWifiMode =
    /WiFi\.mode\s*\(\s*WIFI_STA\s*\)/.test(kode) || /esp_now_init/.test(kode);
  const wifiTerprogram = Boolean(matchWifiBegin || adaWifiMode);
  const ssidTertulis = matchWifiBegin
    ? matchWifiBegin[1] || matchWifiBegin[2] || "HibahIlmu-Guest"
    : adaWifiMode
    ? "ESP-NOW Mesh 2.4GHz"
    : "";

  const adaHeaderMqtt =
    /#include\s*[<"]PubSubClient\.h[>"]/.test(kode) ||
    /#include\s*[<"]MQTT\.h[>"]/.test(kode) ||
    /mqttClient|PubSubClient/i.test(kode);

  const mqttTopicsPublished: { topic: string; payloadExpr: string }[] = [];
  const regexMqttPub = /\.\s*publish\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/g;
  let mPub: RegExpExecArray | null;
  while ((mPub = regexMqttPub.exec(kode)) !== null) {
    mqttTopicsPublished.push({
      topic: mPub[1],
      payloadExpr: mPub[2].trim(),
    });
  }

  const mqttTopicsSubscribed: string[] = [];
  const regexMqttSub = /\.\s*subscribe\s*\(\s*"([^"]+)"\s*\)/g;
  let mSub: RegExpExecArray | null;
  while ((mSub = regexMqttSub.exec(kode)) !== null) {
    mqttTopicsSubscribed.push(mSub[1]);
  }

  const matchBroker = kode.match(
    /setServer\s*\(\s*"([^"]+)"|#define\s+MQTT_SERVER\s+"([^"]+)"/
  );
  const mqttBrokerHost = matchBroker
    ? matchBroker[1] || matchBroker[2]
    : "broker.hibahilmu.id";

  const mqttTerprogram =
    wifiTerprogram && (adaHeaderMqtt || mqttTopicsPublished.length > 0);

  const adaBlynkRun =
    /Blynk\.begin/.test(kode) ||
    /Blynk\.run\s*\(\s*\)/.test(kode) ||
    /BlynkSimpleEsp32/.test(kode);

  const blynkVirtualWrites: { vPin: string; nilaiExpr: string }[] = [];
  const regexBlynkVw = /Blynk\.virtualWrite\s*\(\s*(V\d+)\s*,\s*([^)]+)\)/g;
  let mVw: RegExpExecArray | null;
  while ((mVw = regexBlynkVw.exec(kode)) !== null) {
    blynkVirtualWrites.push({
      vPin: mVw[1],
      nilaiExpr: mVw[2].trim(),
    });
  }

  const blynkVirtualReads: string[] = [];
  const regexBlynkWr = /BLYNK_WRITE\s*\(\s*(V\d+)\s*\)/g;
  let mWr: RegExpExecArray | null;
  while ((mWr = regexBlynkWr.exec(kode)) !== null) {
    if (!blynkVirtualReads.includes(mWr[1])) blynkVirtualReads.push(mWr[1]);
  }

  const matchToken = kode.match(/#define\s+BLYNK_AUTH_TOKEN\s+"([^"]+)"/);
  const blynkAuthToken = matchToken ? matchToken[1] : "";
  const blynkTerprogram =
    adaBlynkRun ||
    blynkVirtualWrites.length > 0 ||
    blynkVirtualReads.length > 0;

  const webServerTerprogram =
    /WebServer\s+/.test(kode) || /server\.on\s*\(/.test(kode);
  const telegramBotTerprogram =
    /UniversalTelegramBot/.test(kode) || /bot\.sendMessage/.test(kode);

  return {
    validSintaksDasar: daftarErrorKompilasi.length === 0,
    daftarErrorKompilasi,
    delayMs,
    baudRateSerial,
    pinOutputTerprogram,
    pinInputTerprogram,
    pinSedangHigh,
    pinSedangLow,
    pinPwmNilai,
    pinAnalogDibaca,
    pinServoTerprogram,
    pinInterruptTerprogram,
    wifiTerprogram,
    ssidTertulis,
    mqttTerprogram,
    mqttBrokerHost,
    mqttTopicsPublished,
    mqttTopicsSubscribed,
    blynkTerprogram,
    blynkAuthToken,
    blynkVirtualWrites,
    blynkVirtualReads,
    webServerTerprogram,
    telegramBotTerprogram,
  };
}

// ============================================================================
// KOMPONEN MONITOR STATUS KODE -> RANGKAIAN -> MQTT -> BLYNK (PURE CREATEELEMENT)
// Bebas sintaks JSX <...> agar 100% kompatibel di dalam file berekstensi .ts!
// ============================================================================
export const StudioCodeDrivenStatusBar: React.FC<{
  statusKode: StatusEksekusiKodeStudio;
  sedangRunning: boolean;
}> = ({ statusKode, sedangRunning }) => {
  const h = React.createElement;

  const adaPinAktif =
    statusKode.pinOutputTerprogram.length > 0 ||
    statusKode.pinAnalogDibaca.length > 0 ||
    Object.keys(statusKode.pinServoTerprogram).length > 0;

  return h(
    "div",
    {
      className:
        "bg-slate-950 border-2 border-slate-800 rounded-2xl p-3.5 text-xs space-y-2.5 shadow-lg",
    },
    // Baris Header
    h(
      "div",
      {
        className:
          "flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2",
      },
      h(
        "div",
        { className: "flex items-center gap-2 font-black text-amber-300" },
        h(Cpu, { className: "w-4 h-4 text-emerald-400" }),
        h(
          "span",
          null,
          "MESIN SINKRONISASI KODINGAN C++ ➔ RANGKAIAN ➔ DASHBOARD MQTT & BLYNK:"
        )
      ),
      h(
        "span",
        {
          className: `px-2.5 py-0.5 rounded-full font-black text-[10px] ${
            !sedangRunning
              ? "bg-slate-800 text-slate-400"
              : statusKode.validSintaksDasar
              ? "bg-emerald-400 text-slate-950"
              : "bg-rose-600 text-white animate-pulse"
          }`,
        },
        !sedangRunning
          ? "⏹ STUDIO STANDBY (KLIK RUN UNTUK EKSEKUSI KODE)"
          : statusKode.validSintaksDasar
          ? "⚡ CODE-DRIVEN ENGINE ACTIVE"
          : "❌ COMPILER ERROR (SIMULASI DIHENTIKAN)"
      )
    ),

    // Grid 4 Indikator Gerbang Kodingan
    h(
      "div",
      { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5" },
      // 1. Pin GPIO
      h(
        "div",
        {
          className: `p-2.5 rounded-xl border ${
            adaPinAktif
              ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/30 border-rose-500/40 text-rose-300"
          }`,
        },
        h(
          "div",
          { className: "font-black text-[11px] flex items-center gap-1.5" },
          h(Cpu, { className: "w-3.5 h-3.5" }),
          " 1. Pin GPIO di Kodingan:"
        ),
        h(
          "div",
          { className: "text-[10px] mt-1 font-mono" },
          "OUT: ",
          statusKode.pinOutputTerprogram.length > 0
            ? statusKode.pinOutputTerprogram.map((p) => `GPIO${p}`).join(", ")
            : "Belum ada pinMode OUTPUT"
        ),
        h(
          "div",
          { className: "text-[10px] font-mono text-sky-300" },
          "IN/ADC: ",
          statusKode.pinAnalogDibaca.length > 0
            ? statusKode.pinAnalogDibaca.map((p) => `GPIO${p}`).join(", ")
            : "Belum ada analogRead/digitalRead"
        )
      ),

      // 2. Stack Wi-Fi
      h(
        "div",
        {
          className: `p-2.5 rounded-xl border ${
            statusKode.wifiTerprogram
              ? "bg-sky-950/30 border-sky-500/50 text-sky-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`,
        },
        h(
          "div",
          { className: "font-black text-[11px] flex items-center gap-1.5" },
          h(Wifi, { className: "w-3.5 h-3.5" }),
          " 2. Stack Wi-Fi di Kodingan:"
        ),
        h(
          "div",
          { className: "text-[10px] mt-1 font-mono" },
          statusKode.wifiTerprogram
            ? `✅ Terhubung ke "${statusKode.ssidTertulis}"`
            : "⚠️ Offline (Belum ada WiFi.begin di kode)"
        )
      ),

      // 3. Broker MQTT
      h(
        "div",
        {
          className: `p-2.5 rounded-xl border ${
            statusKode.mqttTerprogram
              ? "bg-purple-950/30 border-purple-500/50 text-purple-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`,
        },
        h(
          "div",
          { className: "font-black text-[11px] flex items-center gap-1.5" },
          h(Radio, { className: "w-3.5 h-3.5" }),
          " 3. Broker MQTT di Kodingan:"
        ),
        h(
          "div",
          { className: "text-[10px] mt-1 font-mono truncate" },
          statusKode.mqttTerprogram
            ? `✅ Publish (${statusKode.mqttTopicsPublished.length} Topik) -> ${
                statusKode.mqttTopicsPublished[0]?.topic || "hibahilmu/iot"
              }`
            : "⚠️ MQTT Mati (Ketik client.publish di kode)"
        )
      ),

      // 4. Dashboard Blynk
      h(
        "div",
        {
          className: `p-2.5 rounded-xl border ${
            statusKode.blynkTerprogram
              ? "bg-teal-950/30 border-teal-500/50 text-teal-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`,
        },
        h(
          "div",
          { className: "font-black text-[11px] flex items-center gap-1.5" },
          h(Cloud, { className: "w-3.5 h-3.5" }),
          " 4. Dashboard Blynk di Kodingan:"
        ),
        h(
          "div",
          { className: "text-[10px] mt-1 font-mono truncate" },
          statusKode.blynkTerprogram
            ? `✅ Aktif (Virtual Pin: ${
                [
                  ...statusKode.blynkVirtualWrites.map((v) => v.vPin),
                  ...statusKode.blynkVirtualReads,
                ].join(", ") || "Blynk.run()"
              })`
            : "⚠️ Blynk Mati (Ketik Blynk.begin & Blynk.run)"
        )
      )
    ),

    // Kotak Peringatan Error Kompilasi jika ada
    statusKode.daftarErrorKompilasi.length > 0
      ? h(
          "div",
          {
            className:
              "p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 font-mono text-[11px] flex items-center gap-2",
          },
          h(AlertTriangle, { className: "w-4 h-4 text-rose-400 shrink-0" }),
          h("span", null, statusKode.daftarErrorKompilasi[0])
        )
      : null
  );
};