import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import content from "@/lib/content";
import { isDev, smtp, telegramBotToken, telegramChatId } from "@/lib/env";

export const runtime = "nodejs";

type Lead = {
  name: string;
  phone: string;
  email: string;
  message: string;
  company: string;
};

// Простейшая защита от перебора: не больше пяти заявок с одного адреса в час.
const attempts = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);

  attempts.set(ip, [...recent, now]);

  return recent.length >= RATE_LIMIT;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildText(lead: Lead): { subject: string; lines: string[] } {
  const lines = [
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : "",
    lead.message ? `Сообщение: ${lead.message}` : "",
    `Время: ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Samara" })}`
  ].filter(Boolean);

  return { subject: `Заявка с сайта — ${lead.name}`, lines };
}

async function sendToTelegram(lead: Lead): Promise<void> {
  const { subject, lines } = buildText(lead);
  const text = `<b>${escapeHtml(subject)}</b>\n\n${lines.map(escapeHtml).join("\n")}`;

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: telegramChatId, text, parse_mode: "HTML" }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Telegram ${response.status}: ${(await response.text()).slice(0, 200)}`);
  }
}

async function sendToEmail(lead: Lead): Promise<void> {
  const { subject, lines } = buildText(lead);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.password }
  });

  await transporter.sendMail({
    from: `"${content.company.name}" <${smtp.from}>`,
    to: smtp.to,
    replyTo: lead.email || undefined,
    subject,
    text: lines.join("\n")
  });
}

export async function POST(request: Request) {
  let body: Partial<Lead>;

  try {
    body = (await request.json()) as Partial<Lead>;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const lead: Lead = {
    name: String(body.name ?? "").trim().slice(0, 200),
    phone: String(body.phone ?? "").trim().slice(0, 100),
    email: String(body.email ?? "").trim().slice(0, 200),
    message: String(body.message ?? "").trim().slice(0, 3000),
    company: String(body.company ?? "").trim()
  };

  // Скрытое поле заполняют только боты — тихо отвечаем «ок».
  if (lead.company) {
    return NextResponse.json({ ok: true, delivered: [] });
  }

  if (!lead.name || lead.phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ error: "Укажите имя и телефон" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Слишком много заявок, попробуйте позже" }, { status: 429 });
  }

  const delivered: string[] = [];
  const errors: string[] = [];

  if (telegramBotToken && telegramChatId) {
    try {
      await sendToTelegram(lead);
      delivered.push("Telegram");
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  if (smtp.host && smtp.user && smtp.password && smtp.to) {
    try {
      await sendToEmail(lead);
      delivered.push("почта");
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  if (delivered.length === 0) {
    if (isDev) {
      console.info("Заявка (каналы доставки не настроены):", lead);

      return NextResponse.json({ ok: true, delivered: [] });
    }

    console.error("Заявка не доставлена:", errors.join(" | "), lead);

    return NextResponse.json({ error: "Заявка не отправлена. Позвоните нам, пожалуйста." }, { status: 500 });
  }

  if (errors.length > 0) {
    console.error("Часть каналов не сработала:", errors.join(" | "));
  }

  return NextResponse.json({ ok: true, delivered });
}
