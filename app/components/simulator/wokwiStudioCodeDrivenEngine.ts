// app/components/simulator/wokwiStudioCodeDrivenEngine.ts

export interface StatusEksekusiKodeStudio {
  // Status Kompilasi Dasar
  validSintaksDasar: boolean;
  daftarErrorKompilasi: string[];
  delayMs: number;
  baudRateSerial: number;

  // Pemetaan Pin Fisik yang Diprogram di Kodingan C++
  pinOutputTerprogram: number[]; // dari pinMode(pin, OUTPUT)
  pinInputTerprogram: number[]; // dari pinMode(pin, INPUT / INPUT_PULLUP)
  pinSedangHigh: number[]; // dari digitalWrite(pin, HIGH)
  pinSedangLow: number[]; // dari digitalWrite(pin, LOW)
  pinPwmNilai: Record<number, number>; // dari analogWrite(pin, val)
  pinAnalogDibaca: number[]; // dari analogRead(pin)
  pinServoTerprogram: Record<number, number>; // dari servo.attach(pin) & servo.write(sudut)
  pinInterruptTerprogram: number[]; // dari attachInterrupt

  // Status Jaringan Wi-Fi (Wajib ada di kodingan agar Dashboard/MQTT/Blynk hidup!)
  wifiTerprogram: boolean;
  ssidTertulis: string;

  // Status MQTT Broker (Wajib ada PubSubClient / client.publish di kodingan!)
  mqttTerprogram: boolean;
  mqttBrokerHost: string;
  mqttTopicsPublished: { topic: string; payloadExpr: string }[];
  mqttTopicsSubscribed: string[];

  // Status Blynk IoT Cloud (Wajib ada Blynk.begin & Blynk.run di kodingan!)
  blynkTerprogram: boolean;
  blynkAuthToken: string;
  blynkVirtualWrites: { vPin: string; nilaiExpr: string }[];
  blynkVirtualReads: string[];

  // Status HTTP WebServer / Telegram Bot
  webServerTerprogram: boolean;
  telegramBotTerprogram: boolean;
}

export function analisisKodeStudioLengkap(
  kodeMentah: string
): StatusEksekusiKodeStudio {
  const daftarErrorKompilasi: string[] = [];

  // Bersihkan komentar C++ agar komentar tidak dianggap sebagai kode aktif
  const kode = (kodeMentah || "")
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  // 1. Cek fungsi wajib setup() dan loop()
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

  // Cek keseimbangan kurung kurawal
  const kurungBuka = (kode.match(/\{/g) || []).length;
  const kurungTutup = (kode.match(/\}/g) || []).length;
  if (kurungBuka === 0 || kurungBuka !== kurungTutup) {
    daftarErrorKompilasi.push(
      `Syntax Error: Jumlah kurung kurawal tidak seimbang ('{' = ${kurungBuka}, '}' = ${kurungTutup}).`
    );
  }

  // 2. Ekstrak Serial.begin(baud) dan delay(ms)
  const matchBaud = kode.match(/Serial\.begin\s*\(\s*(\d+)\s*\)/);
  const baudRateSerial = matchBaud ? parseInt(matchBaud[1], 10) : 0;

  const matchDelay = kode.match(/delay\s*\(\s*(\d+)\s*\)/);
  const delayMs = matchDelay ? Math.max(80, parseInt(matchDelay[1], 10)) : 800;

  // 3. Resolusi makro #define dan konstanta int (misal #define LED_PIN 2 atau const int RELAY = 26;)
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

  // 4. Ekstrak pinMode(pin, MODE)
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

  // 5. Ekstrak digitalWrite(pin, HIGH/LOW)
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

  // 6. Ekstrak analogWrite(pin, nilai)
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

  // 7. Ekstrak analogRead(pin) & digitalRead(pin)
  const pinAnalogDibaca: number[] = [];
  const regexAr = /(?:analogRead|digitalRead)\s*\(\s*([A-Za-z0-9_]+)\s*\)/g;
  let mAr: RegExpExecArray | null;
  while ((mAr = regexAr.exec(kode)) !== null) {
    const noPin = resolusiNomorPin(mAr[1]);
    if (noPin !== null && !pinAnalogDibaca.includes(noPin)) {
      pinAnalogDibaca.push(noPin);
    }
  }

  // 8. Ekstrak Servo (.attach(pin) & .write(sudut))
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

  // 9. Ekstrak External Interrupt
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

  // 10. CEK KONEKSI WI-FI DI KODINGAN (WAJIB UNTUK DASHBOARD, MQTT, & BLYNK!)
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

  // 11. CEK PROTOKOL MQTT DI KODINGAN (PubSubClient, client.publish, client.subscribe)
  const adaHeaderMqtt =
    /#include\s*[<"]PubSubClient\.h[>"]/.test(kode) ||
    /#include\s*[<"]MQTT\.h[>"]/.test(kode) ||
    /mqttClient|PubSubClient/i.test(kode);

  const mqttTopicsPublished: { topic: string; payloadExpr: string }[] = [];
  const regexMqttPub =
    /\.\s*publish\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)/g;
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

  // 12. CEK PROTOKOL BLYNK IOT CLOUD DI KODINGAN (Blynk.begin, Blynk.virtualWrite, BLYNK_WRITE)
  const adaBlynkRun =
    /Blynk\.begin/.test(kode) ||
    /Blynk\.run\s*\(\s*\)/.test(kode) ||
    /BlynkSimpleEsp32/.test(kode);

  const blynkVirtualWrites: { vPin: string; nilaiExpr: string }[] = [];
  const regexBlynkVw =
    /Blynk\.virtualWrite\s*\(\s*(V\d+)\s*,\s*([^)]+)\)/g;
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

  const matchToken = kode.match(
    /#define\s+BLYNK_AUTH_TOKEN\s+"([^"]+)"/
  );
  const blynkAuthToken = matchToken ? matchToken[1] : "";
  const blynkTerprogram =
    adaBlynkRun ||
    blynkVirtualWrites.length > 0 ||
    blynkVirtualReads.length > 0;

  // 13. Cek HTTP WebServer & Telegram Bot
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
// KOMPONEN MONITOR STATUS KODE -> RANGKAIAN -> MQTT -> BLYNK DI STUDIO KANVAS
// ============================================================================
import React from "react";
import { Wifi, Radio, Cloud, Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";

export const StudioCodeDrivenStatusBar: React.FC<{
  statusKode: StatusEksekusiKodeStudio;
  sedangRunning: boolean;
}> = ({ statusKode, sedangRunning }) => {
  return (
    <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-3.5 text-xs space-y-2.5 shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-black text-amber-300">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>
            MESIN SINKRONISASI KODINGAN C++ ➔ RANGKAIAN ➔ DASHBOARD MQTT &amp; BLYNK:
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
            !sedangRunning
              ? "bg-slate-800 text-slate-400"
              : statusKode.validSintaksDasar
              ? "bg-emerald-400 text-slate-950"
              : "bg-rose-600 text-white animate-pulse"
          }`}
        >
          {!sedangRunning
            ? "⏹ STUDIO STANDBY (KLIK RUN UNTUK EKSEKUSI KODE)"
            : statusKode.validSintaksDasar
            ? "⚡ CODE-DRIVEN ENGINE ACTIVE"
            : "❌ COMPILER ERROR (SIMULASI DIHENTIKAN)"}
        </span>
      </div>

      {/* 4 Indikator Gerbang Kodingan: GPIO Pin, Wi-Fi, MQTT Broker, dan Blynk Cloud */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. Status Pin GPIO yang Diprogram di Kode */}
        <div
          className={`p-2.5 rounded-xl border ${
            statusKode.pinOutputTerprogram.length > 0 ||
            statusKode.pinAnalogDibaca.length > 0 ||
            Object.keys(statusKode.pinServoTerprogram).length > 0
              ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/30 border-rose-500/40 text-rose-300"
          }`}
        >
          <div className="font-black text-[11px] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> 1. Pin GPIO di Kodingan:
          </div>
          <div className="text-[10px] mt-1 font-mono">
            OUT:{" "}
            {statusKode.pinOutputTerprogram.length > 0
              ? statusKode.pinOutputTerprogram.map((p) => `GPIO${p}`).join(", ")
              : "Belum ada pinMode OUTPUT"}
          </div>
          <div className="text-[10px] font-mono text-sky-300">
            IN/ADC:{" "}
            {statusKode.pinAnalogDibaca.length > 0
              ? statusKode.pinAnalogDibaca.map((p) => `GPIO${p}`).join(", ")
              : "Belum ada analogRead/digitalRead"}
          </div>
        </div>

        {/* 2. Status Wi-Fi di Kodingan */}
        <div
          className={`p-2.5 rounded-xl border ${
            statusKode.wifiTerprogram
              ? "bg-sky-950/30 border-sky-500/50 text-sky-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          <div className="font-black text-[11px] flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" /> 2. Stack Wi-Fi di Kodingan:
          </div>
          <div className="text-[10px] mt-1 font-mono">
            {statusKode.wifiTerprogram
              ? `✅ Terhubung ke "${statusKode.ssidTertulis}"`
              : "⚠️ Offline (Belum ada WiFi.begin di kode)"}
          </div>
        </div>

        {/* 3. Status Broker MQTT di Kodingan */}
        <div
          className={`p-2.5 rounded-xl border ${
            statusKode.mqttTerprogram
              ? "bg-purple-950/30 border-purple-500/50 text-purple-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          <div className="font-black text-[11px] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> 3. Broker MQTT di Kodingan:
          </div>
          <div className="text-[10px] mt-1 font-mono truncate">
            {statusKode.mqttTerprogram
              ? `✅ Publish (${statusKode.mqttTopicsPublished.length} Topik) -> ${
                  statusKode.mqttTopicsPublished[0]?.topic || "hibahilmu/iot"
                }`
              : "⚠️ MQTT Mati (Ketik client.publish di kode)"}
          </div>
        </div>

        {/* 4. Status Dashboard Blynk Cloud di Kodingan */}
        <div
          className={`p-2.5 rounded-xl border ${
            statusKode.blynkTerprogram
              ? "bg-teal-950/30 border-teal-500/50 text-teal-200"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          <div className="font-black text-[11px] flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5" /> 4. Dashboard Blynk di Kodingan:
          </div>
          <div className="text-[10px] mt-1 font-mono truncate">
            {statusKode.blynkTerprogram
              ? `✅ Aktif (Virtual Pin: ${
                  [
                    ...statusKode.blynkVirtualWrites.map((v) => v.vPin),
                    ...statusKode.blynkVirtualReads,
                  ].join(", ") || "Blynk.run()"
                })`
              : "⚠️ Blynk Mati (Ketik Blynk.begin & Blynk.run)"}
          </div>
        </div>
      </div>

      {statusKode.daftarErrorKompilasi.length > 0 && (
        <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 font-mono text-[11px] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{statusKode.daftarErrorKompilasi[0]}</span>
        </div>
      )}
    </div>
  );
};