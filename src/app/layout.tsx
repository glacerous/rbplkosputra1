import type { Metadata } from "next";
import { Balsamiq_Sans } from "next/font/google";
import "./globals.css";

const balsamiqSans = Balsamiq_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kos Putra Friendly",
  description: "Modern living for the modern student",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${balsamiqSans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
