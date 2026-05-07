import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ToastContainer } from "react-toastify";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ToastProvider from "@/utilis/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexgen Cosys Reports",
  description:
    "View and export RDLC Reports with pagination and download functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="m-0 p-0">
      <body className={`${inter.className} m-0 p-0`} suppressHydrationWarning>
        <ToastProvider />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
