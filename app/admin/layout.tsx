import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админка — Неон Графикс",
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0f0f0d] text-white">{children}</div>;
}
