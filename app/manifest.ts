import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HibahIlmu - Belajar Gratis TK sampai Kuliah",
    short_name: "HibahIlmu",
    description: "Platform pengabdian masyarakat belajar gratis karya Panda Kode",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#059669",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}