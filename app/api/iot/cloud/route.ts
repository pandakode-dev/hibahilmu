// app/api/iot/cloud/route.ts
import { NextRequest, NextResponse } from "next/server";

export interface StatePinPerToken {
  token: string;
  pemilikNama: string;
  namaProject: string;
  virtualPins: { [pin: string]: number | string };
  statusAktuator: { [idAtauPin: string]: boolean };
  logPesan: {
    waktu: string;
    sumber: "ESP32_HARDWARE" | "ANDROID_APP" | "WEB_SIMULATOR";
    topik: string;
    payload: string;
  }[];
  terakhirUpdate: string;
}

// Penyimpanan In-Memory Server untuk seluruh Token Akun/Project yang sedang RUNNING
const CLOUD_IOT_STORE: { [token: string]: StatePinPerToken } = {};

function pastikanTokenAda(
  token: string,
  pemilikNama = "Pengguna HibahIlmu",
  namaProject = "IoT Smart Project"
): StatePinPerToken {
  if (!CLOUD_IOT_STORE[token]) {
    CLOUD_IOT_STORE[token] = {
      token,
      pemilikNama,
      namaProject,
      virtualPins: {
        V0: 29,
        V1: 40,
        V2: 1,
        V3: 90,
      },
      statusAktuator: {
        V1: true,
        V2: true,
      },
      logPesan: [
        {
          waktu: new Date().toLocaleTimeString("id-ID"),
          sumber: "WEB_SIMULATOR",
          topik: `hibahilmu/${token.slice(0, 12)}/status`,
          payload: '{"status":"BROKER_HIBAHILMU_ONLINE","ready":true}',
        },
      ],
      terakhirUpdate: new Date().toLocaleTimeString("id-ID"),
    };
  }
  return CLOUD_IOT_STORE[token];
}

// GET /api/iot/cloud?token=xxx&pin=V1
// Digunakan oleh ESP32 Fisik, Aplikasi Android, dan Simulator Web untuk membaca nilai terbaru
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "default_token";
  const pin = searchParams.get("pin");

  const dataToken = pastikanTokenAda(token);

  if (pin) {
    return NextResponse.json({
      ok: true,
      token,
      pin,
      value: dataToken.virtualPins[pin] ?? 0,
      aktuatorNyala: dataToken.statusAktuator[pin] ?? false,
      terakhirUpdate: dataToken.terakhirUpdate,
    });
  }

  return NextResponse.json({
    ok: true,
    broker: "HibahIlmu Self-Hosted IoT Broker v2.6",
    data: dataToken,
  });
}

// POST /api/iot/cloud
// Digunakan oleh ESP32 Fisik, Remote Android, atau Simulator Web untuk mengubah nilai Virtual Pin / Publish pesan
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string = body.token || "default_token";
    const pemilikNama: string = body.pemilikNama || "Pengguna HibahIlmu";
    const namaProject: string = body.namaProject || "IoT Smart Project";
    const sumber: "ESP32_HARDWARE" | "ANDROID_APP" | "WEB_SIMULATOR" =
      body.sumber || "WEB_SIMULATOR";

    const state = pastikanTokenAda(token, pemilikNama, namaProject);
    state.pemilikNama = pemilikNama;
    state.namaProject = namaProject;

    const jam = new Date().toLocaleTimeString("id-ID");
    state.terakhirUpdate = jam;

    // Jika mengirim perubahan spesifik pada Virtual Pin (misal V0, V1, V2)
    if (body.pin !== undefined && body.value !== undefined) {
      state.virtualPins[body.pin] = body.value;
      const boolVal =
        body.value === 1 ||
        body.value === "1" ||
        body.value === true ||
        String(body.value).toUpperCase() === "ON" ||
        String(body.value).toUpperCase() === "UNLOCK";
      state.statusAktuator[body.pin] = boolVal;

      state.logPesan = [
        {
          waktu: jam,
          sumber,
          topik: `hibahilmu/${token.slice(0, 12)}/pin/${body.pin}`,
          payload: JSON.stringify({
            pin: body.pin,
            value: body.value,
            aktuator: boolVal ? "ON" : "OFF",
          }),
        },
        ...state.logPesan.slice(0, 24),
      ];
    }

    // Jika mengirim bulk update semua virtualPins dari kanvas
    if (body.virtualPins && typeof body.virtualPins === "object") {
      state.virtualPins = { ...state.virtualPins, ...body.virtualPins };
    }

    // Jika mengirim pesan topik MQTT custom
    if (body.topik && body.payload) {
      state.logPesan = [
        {
          waktu: jam,
          sumber,
          topik: body.topik,
          payload:
            typeof body.payload === "string"
              ? body.payload
              : JSON.stringify(body.payload),
        },
        ...state.logPesan.slice(0, 24),
      ];
    }

    return NextResponse.json({
      ok: true,
      message: "State IoT Broker HibahIlmu berhasil diperbarui",
      data: state,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}