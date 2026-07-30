import type { Metadata } from "next";
import { Manrope, Russo_One } from "next/font/google";
import content from "@/lib/content";
import "./globals.css";

const russoOne = Russo_One({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-russo-one"
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={content.meta.lang}>
      <body className={`${russoOne.variable} ${manrope.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
