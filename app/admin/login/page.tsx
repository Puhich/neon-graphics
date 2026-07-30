import Image from "next/image";
import { Suspense } from "react";

import LoginForm from "@/components/admin/LoginForm";
import { isAuthConfigured, isDev } from "@/lib/env";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute left-[8%] top-[-6rem] h-72 w-[30rem] rounded-full bg-brand-blue/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[6%] h-72 w-[32rem] rounded-full bg-brand-accent/20 blur-[120px]" />
      <Image
        aria-hidden
        className="pointer-events-none absolute right-[-4rem] top-1/2 hidden w-[26rem] -translate-y-1/2 opacity-[0.07] brightness-0 invert lg:block"
        src="/fish-mark.webp"
        alt=""
        width={420}
        height={520}
      />

      <div className="relative w-full max-w-[420px]">
        <Image className="mx-auto h-14 w-auto" src="/logo-dark.svg" alt="Неон Графикс" width={185} height={80} priority />
        <h1 className="mt-8 text-center font-heading text-[26px]">Вход в админку</h1>
        <p className="mt-2 text-center text-[14px] text-[#8a8a8a]">
          Управление содержимым сайта: тексты, фотографии, контакты.
        </p>

        <Suspense fallback={<div className="mt-7 h-[320px] rounded-2xl border border-white/10 bg-[#151513]" />}>
          <LoginForm />
        </Suspense>

        {!isAuthConfigured ? (
          <p className="mt-5 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-4 text-[13px] leading-[1.5] text-[#ffb3ba]">
            Не заданы переменные ADMIN_LOGIN, ADMIN_PASSWORD и SESSION_SECRET — вход невозможен.
          </p>
        ) : null}

        {isDev && !process.env.ADMIN_LOGIN ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-[#151513] p-4 text-[13px] leading-[1.5] text-[#8a8a8a]">
            Локальный режим: логин <span className="font-bold text-white">admin</span>, пароль{" "}
            <span className="font-bold text-white">admin</span>. На проде значения берутся из переменных окружения.
          </p>
        ) : null}
      </div>
    </main>
  );
}
