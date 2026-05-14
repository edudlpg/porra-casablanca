import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Porra Casablanca",
  description: "Gestiona una porra del Mundial desde una interfaz mobile-first.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
