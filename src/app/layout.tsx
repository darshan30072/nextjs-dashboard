import type { Metadata } from "next";
import { Sen } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { toastOptions } from "@/models/toastConfigModel";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Food Ordering",
  description: "Codevolution",
  icons: "/icons/logo.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sen.variable} antialiased`}
      >
        <Toaster position="bottom-left" reverseOrder={false} toastOptions={toastOptions} />
        {children}
      </body>
    </html>
  );
}
