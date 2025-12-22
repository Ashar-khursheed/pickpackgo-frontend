import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalLayout from "@/layouts/global";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PikPakGo",
  description: "PikPakGo is Booking platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}