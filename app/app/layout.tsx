import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-archivo",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "J.M.E STUDIO — Style Sans Filtre",
  description:
    "Vêtements, chaussures, accessoires et parfums pour l'homme moderne. Cap-Haïtien & diaspora.",
  openGraph: {
    title: "J.M.E STUDIO — Style Sans Filtre",
    description: "Commande via WhatsApp, paiement sécurisé via Payoneer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${archivo.variable} ${grotesk.variable} font-body text-ink antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
