"use client";

import React, { useEffect, useRef, useState } from "react";
import { AkunPengguna } from "../types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface GoogleSsoWebProps {
  rolePilihan: "siswa" | "guru";
  instansiPilihan?: string;
  onBerhasilLoginGoogle: (akun: AkunPengguna) => void;
}

export const GoogleSsoButtonWeb: React.FC<GoogleSsoWebProps> = ({
  rolePilihan,
  instansiPilihan = "HibahIlmu Web Google SSO",
  onBerhasilLoginGoogle,
}) => {
  const googleBtnContainerRef = useRef<HTMLDivElement | null>(null);
  const [sedangMemproses, setSedangMemproses] = useState<boolean>(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "1043466129331-1b2t0m91ku0i6l02b0ve6o45dbg5coof.apps.googleusercontent.com";

  const verifikasiCredentialKeServer = async (idToken: string) => {
    setSedangMemproses(true);
    setPesanError(null);
    try {
      const res = await fetch("/api/mobile/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "google_sso",
          idToken: idToken,
          role: rolePilihan,
          instansi: instansiPilihan,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setPesanError(json.message || "Gagal verifikasi Google SSO");
      } else if (json.user) {
        onBerhasilLoginGoogle({
          id: json.user.id,
          nama: json.user.nama,
          email: json.user.email,
          password: "",
          role: json.user.role,
          status: "approved",
          infoTambahan: json.user.instansi || instansiPilihan,
          waktuDaftar: "Hari ini (Google SSO)",
          xp: json.user.xp || 550,
        });
      }
    } catch {
      setPesanError("Gagal menghubungi server autentikasi hibahilmu.my.id.");
    } finally {
      setSedangMemproses(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    const scriptId = "google-gsi-client-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initGsi = () => {
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        googleBtnContainerRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp) => {
            if (resp.credential) {
              verifikasiCredentialKeServer(resp.credential);
            }
          },
        });
        window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 300,
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [clientId, rolePilihan, instansiPilihan]);

  return (
    <div className="space-y-3 flex flex-col items-center w-full">
      <div
        ref={googleBtnContainerRef}
        className="flex justify-center min-h-[44px]"
      />

      {sedangMemproses && (
        <div className="text-xs font-bold text-emerald-600 animate-pulse text-center">
          Memverifikasi akun Google ({rolePilihan.toUpperCase()}) ke server...
        </div>
      )}

      {pesanError && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 text-center">
          {pesanError}
        </div>
      )}
    </div>
  );
};