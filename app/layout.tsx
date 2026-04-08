"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {isLoginPage ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              {children}
            </div>
          ) : (
            <AdminLayout>{children}</AdminLayout>
          )}

          {/* ✅ TOASTER DOIT ÊTRE ICI */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              className:
                "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}