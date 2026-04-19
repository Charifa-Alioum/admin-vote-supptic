"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* ThemeProvider en premier pour que toute l'app ait accès au thème */}
        <ThemeProvider>
          {/* LanguageProvider enveloppe toute l'app pour la traduction globale */}
          <LanguageProvider>

            {isLoginPage ? children : <AdminLayout>{children}</AdminLayout>}

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                className:
                  "bg-[var(--surface)] text-[var(--foreground)] shadow-lg rounded-lg",
              }}
            />

          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}