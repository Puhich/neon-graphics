import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админка — Неон Графикс",
  robots: { index: false, follow: false }
};

// Тема выставляется до первой отрисовки, иначе светлая админка на мгновение
// мигает тёмной. Скрипт крошечный и работает синхронно.
const themeScript = `(function(){try{var t=localStorage.getItem("ng-admin-theme");document.documentElement.dataset.adminTheme=t==="light"?"light":"dark";}catch(e){}})();`;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className="min-h-screen bg-[var(--adm-bg)] text-[var(--adm-text)]">{children}</div>
    </>
  );
}
