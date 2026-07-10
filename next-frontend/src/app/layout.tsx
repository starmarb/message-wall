import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/doodle/site-header";

export const metadata: Metadata = {
  title: "doodle",
  description: "doodle and whatnot",
  icons: {
    icon: "./favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="w-full h-full bg-black text-white">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
