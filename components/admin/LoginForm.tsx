"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: formData.get("login"),
          password: formData.get("password")
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Не удалось войти");
        setIsSending(false);
        return;
      }

      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Сервер недоступен, попробуйте ещё раз");
      setIsSending(false);
    }
  };

  return (
    <form className="mt-7 rounded-2xl border border-white/10 bg-[#151513] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]" onSubmit={handleSubmit}>
      <label className="grid gap-1.5 text-[13px] text-[#8a8a8a]">
        <span>Логин</span>
        <input
          autoComplete="username"
          className="h-11 rounded-xl border border-white/10 bg-[#0f0f0d] px-4 text-[15px] text-white outline-none transition focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/25"
          name="login"
          required
          type="text"
        />
      </label>

      <label className="mt-4 grid gap-1.5 text-[13px] text-[#8a8a8a]">
        <span>Пароль</span>
        <input
          autoComplete="current-password"
          className="h-11 rounded-xl border border-white/10 bg-[#0f0f0d] px-4 text-[15px] text-white outline-none transition focus:border-brand-accent/60 focus:ring-2 focus:ring-brand-accent/25"
          name="password"
          required
          type="password"
        />
      </label>

      {error ? <p className="mt-4 text-[13px] font-semibold text-brand-accent">{error}</p> : null}

      <button
        className="mt-6 h-12 w-full rounded-xl bg-brand-accent text-[15px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSending}
        type="submit"
      >
        {isSending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
