import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Google_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "400", 
  variable: "--font-google-sans",
});


export const metadata: Metadata = {
  title: "Reg Card",
  description: "Component for event registration cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${googleSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
