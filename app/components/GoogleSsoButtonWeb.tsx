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

interface GoogleSsoWebProps {
  rolePilihan: "siswa" | "guru";
  onBerhasilLoginGoogle: (akun: AkunPengguna) => void;
}

export const GoogleSsoButtonWeb: React.FC<GoogleSsoWebProps> = ({
  rolePilihan,
  onBerhasilLoginGoogle,
}) => {
  const googleBtnContainerRef = useRef<HTMLDivElement | null>(null);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "MASUKKAN_WEB_CLIENT_ID_ANDA_DISINI.apps.googleusercontent.com";

  const verifikasiCredentialKeServer = async (idToken: string) => {
    setSedangMemproses(true);
    setPesanError(null);
    try {
      const res = await fetch("/api/mobile/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "google_sso",
          idToken,
          role: rolePilihan,
          instansi: "HibahIlmu Web Google SSO",
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
          infoTambahan: json.user.instansi,
          waktuDaftar: "Hari ini (Google SSO)",
          xp: json.user.xp || 550,
        });
      }
    } catch {
      setPesanError("Gagal menghubungi server autentikasi.");
    } finally {
      setSedangMemproses(false);
    }
  };

  useEffect(() => {
    if (!clientId || clientId.startsWith("MASUKKAN_")) return;

    const scriptId = "google-gsi-client-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initGsi = () => {
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
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
          width: 320,
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
  }, [clientId, rolePilihan]);

  return (
    <div className="space-y-2.5 flex flex-col items-center w-full">
      {/* Container Resmi Tombol Google Identity Services */}
      <div ref={googleBtnContainerRef} className="flex justify-center" />

      {sedangMemproses && (
        <div className="text-xs font-bold text-emerald-600 animate-pulse">
          🔄 Memverifikasi akun Google ke server hibahilmu.my.id...
        </div>
      )}

      {pesanError && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          ⚠️ {pesanError}
        </div>
      )}
    </div>
  );
};