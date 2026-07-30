"use client";

import { useEffect, useState } from "react";

import { Card, Note, Page } from "@/components/admin/ui";

type Status = {
  isDev: boolean;
  publish: { configured: boolean; repo: string | null; branch: string };
  telegram: { configured: boolean };
  email: { configured: boolean };
  history: { message: string; date: string; url: string }[];
};

function StatusRow({ label, ok, hint }: { label: string; ok: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-3">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ok ? "bg-[#3fb950]" : "bg-[#f3a40d]"}`} />
      <span>
        <span className="block text-[14px] text-white">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-[1.45] text-[#6f6f6a]">{hint}</span>
      </span>
      <span className={`ml-auto text-[12px] font-bold ${ok ? "text-[#3fb950]" : "text-[#f3a40d]"}`}>
        {ok ? "настроено" : "не настроено"}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [testState, setTestState] = useState<{ status: "idle" | "sending" | "done" | "error"; message?: string }>({
    status: "idle"
  });

  useEffect(() => {
    fetch("/api/admin/status")
      .then((response) => response.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const sendTestLead = async () => {
    setTestState({ status: "sending" });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Тестовая заявка из админки",
          phone: "+7 000 000-00-00",
          email: "",
          message: "Проверка связи: если вы это читаете, заявки доходят.",
          company: ""
        })
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string; delivered?: string[] };

      if (!response.ok) {
        setTestState({ status: "error", message: data.error ?? "Не удалось отправить" });
        return;
      }

      setTestState({
        status: "done",
        message: data.delivered?.length
          ? `Отправлено: ${data.delivered.join(", ")}`
          : "Заявка принята, но каналы доставки не настроены"
      });
    } catch {
      setTestState({ status: "error", message: "Сервер недоступен" });
    }
  };

  return (
    <Page title="Проверка интеграций" description="Что подключено на сервере и доходят ли заявки.">
      <Card title="Подключения">
        {status ? (
          <>
            <StatusRow
              hint={
                status.publish.configured
                  ? `Публикация идёт в ${status.publish.repo}, ветка ${status.publish.branch}`
                  : "Нет токена GitHub — правки сохраняются только на этом компьютере"
              }
              label="Публикация сайта"
              ok={status.publish.configured}
            />
            <StatusRow
              hint="Заявки приходят в Telegram-бот"
              label="Telegram"
              ok={status.telegram.configured}
            />
            <StatusRow hint="Заявки дублируются на почту" label="Почта" ok={status.email.configured} />
            {status.isDev ? <Note>Локальный режим разработки: публикация пишет файлы на диск.</Note> : null}
          </>
        ) : (
          <p className="text-[13px] text-[#6f6f6a]">Загружаем…</p>
        )}
      </Card>

      <Card title="Тестовая заявка" description="Отправит в те же каналы, что и форма на сайте.">
        <button
          className="justify-self-start rounded-xl border border-white/15 px-4 py-2.5 text-[13px] font-semibold text-[#c9c9c4] transition hover:border-brand-accent/60 hover:text-white disabled:opacity-50"
          disabled={testState.status === "sending"}
          onClick={sendTestLead}
          type="button"
        >
          {testState.status === "sending" ? "Отправляем…" : "Отправить тестовую заявку"}
        </button>
        {testState.message ? (
          <p
            className={`text-[13px] ${testState.status === "error" ? "text-brand-accent" : "text-[#3fb950]"}`}
          >
            {testState.message}
          </p>
        ) : null}
      </Card>

      {status && status.history.length > 0 ? (
        <Card title="История публикаций" description="Каждая публикация сохраняется и её можно откатить.">
          <ul className="grid gap-2">
            {status.history.map((item) => (
              <li key={item.url}>
                <a
                  className="block rounded-xl border border-white/10 bg-[#0f0f0d] px-4 py-3 transition hover:border-white/25"
                  href={item.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="block truncate text-[14px] text-white">{item.message}</span>
                  <span className="mt-0.5 block text-[12px] text-[#6f6f6a]">
                    {new Date(item.date).toLocaleString("ru-RU")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </Page>
  );
}
