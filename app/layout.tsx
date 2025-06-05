import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers";
import { QueryProvider } from "@/providers/Query";
import { Toaster } from "sonner";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Rauschen = localFont({
  src: "../fonts/Rauschen-BBook-Web.woff",
  variable: "--font-clen",
  display: "swap",
});
const title = "CLIQK";
// Define a description for the platform, highlighting its purpose and offerings
const description =
  "CLIQK is a platform for sharing and discovering products, services, and experiences. We provide affordable phone accessories and allow users to create and share their own product lists, as well as explore lists created by others. With a focus on community and collaboration, CLIQK aims to make it easy for users to find and share the best products and services available.";
export const metadata: Metadata = {
  title: title,
  description: description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable}  ${Rauschen.className} antialiased`}
      >
        <Toaster richColors={true} position="top-center" />
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
