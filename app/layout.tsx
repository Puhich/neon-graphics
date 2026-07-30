import type { Metadata } from "next";
import { Manrope, Russo_One } from "next/font/google";

import content from "@/lib/content";
import { siteUrl } from "@/lib/site";
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

const base = siteUrl(content);

// Домен вводится в админке. Пока он не задан, canonical и абсолютные ссылки
// в превью не строятся — иначе поисковики запомнят неправильный адрес.
export const metadata: Metadata = {
  ...(base ? { metadataBase: new URL(base), alternates: { canonical: "/" } } : {}),
  title: content.meta.title,
  description: content.meta.description,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/apple-icon.png"
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: content.company.name,
    title: content.meta.ogTitle || content.meta.title,
    description: content.meta.ogDescription || content.meta.description,
    ...(base ? { url: base } : {}),
    ...(content.meta.ogImage
      ? { images: [{ url: content.meta.ogImage, width: 1200, height: 630, alt: content.company.name }] }
      : {})
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.ogTitle || content.meta.title,
    description: content.meta.ogDescription || content.meta.description,
    ...(content.meta.ogImage ? { images: [content.meta.ogImage] } : {})
  },
  verification: {
    ...(content.meta.yandexVerification ? { yandex: content.meta.yandexVerification } : {}),
    ...(content.meta.googleVerification ? { google: content.meta.googleVerification } : {})
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={content.meta.lang}>
      <body className={`${russoOne.variable} ${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
