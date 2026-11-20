import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });

export const metadata = {
  title: "MiniShop",
  description: "Mode, tech et maison — workshop e-commerce MERN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geist.variable} ${bricolage.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
