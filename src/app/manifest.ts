import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Territorio Tomado",
    short_name: "Territorio",
    description: "Mapa Popular dos Imoveis da CSN em Volta Redonda",
    start_url: "/",
    display: "standalone",
    background_color: "#3b474f",
    theme_color: "#3b474f",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
