import type { Metadata } from "next";
import localFont from "next/font/local";
import Novbar from "@/components/Novbar";
import "./globals.css";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Elbek Desinger",
  description: "Buyurtma qilish ",
  icons: { icon: "/public/dddd.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[url('https://t4.ftcdn.net/jpg/04/94/85/25/360_F_494852538_r8ylVApdAY0YuWYCkWIsg5pDZkboERYI.jpg')] bg  bg-cover overflow-auto h-full max-h-full  -z-10 absolute text-slate-700    `}
      >
        <Novbar />
        <main className="aligen-content  ">{children}</main>
      </body>
    </html>
  );
}
