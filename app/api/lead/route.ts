import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sharp from "sharp";

import { getContent } from "@/lib/content";
import { isValidEmail } from "@/lib/email";
import { leadEmailHtml } from "@/lib/lead-email";
import { isDev, smtp, telegramBotToken, telegramChatId } from "@/lib/env";

export const runtime = "nodejs";

type Lead = {
  name: string;
  phone: string;
  email: string;
  message: string;
  company: string;
};

type Photo = { filename: string; content: Buffer };

// Фото из формы: не больше пяти, каждое до 10 МБ на входе. Сжимаем до
// 1600px по длинной стороне и JPEG ~80% — с телефона 6–8 МБ превращаются
// в 300–500 КБ, письмо остаётся лёгким. На диске ничего не храним.
const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

async function preparePhotos(files: File[]): Promise<Photo[]> {
  const photos: Photo[] = [];

  const accepted = files.slice(0, MAX_PHOTOS);

  for (let index = 0; index < accepted.length; index += 1) {
    const file = accepted[index];
    if (!file.type.startsWith("image/") || file.size === 0 || file.size > MAX_PHOTO_BYTES) {
      continue;
    }

    const input = Buffer.from(await file.arrayBuffer());
    const content = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    photos.push({ filename: `photo-${index + 1}.jpg`, content });
  }

  return photos;
}

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

function buildText(lead: Lead, photoCount = 0): { subject: string; lines: string[] } {
  // Контакты — построчно, сообщение — отдельным блоком через пустую строку,
  // чтобы в письме оно не сливалось с полями.
  const lines = [
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : "",
    photoCount > 0 ? `Фото: ${photoCount} во вложении` : "",
    lead.message ? `\nСообщение:\n${lead.message}\n` : "",
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

async function sendToEmail(lead: Lead, photos: Photo[]): Promise<void> {
  const { subject, lines } = buildText(lead, photos.length);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.password }
  });

  const content = getContent();

  await transporter.sendMail({
    from: `"${content.company.name}" <${smtp.from}>`,
    to: smtp.to,
    replyTo: lead.email || undefined,
    subject,
    text: lines.join("\n"),
    html: leadEmailHtml({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      time: new Date().toLocaleString("ru-RU", { timeZone: "Europe/Samara" }),
      photoCount: photos.length
    }),
    attachments: photos.map((photo) => ({ filename: photo.filename, content: photo.content, contentType: "image/jpeg" }))
  });
}

export async function POST(request: Request) {
  let body: Partial<Lead>;
  let files: File[] = [];

  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const field = (key: string) => String(formData.get(key) ?? "");
      body = { name: field("name"), phone: field("phone"), email: field("email"), message: field("message"), company: field("company") };
      files = formData.getAll("photos").filter((item): item is File => item instanceof File);
    } else {
      body = (await request.json()) as Partial<Lead>;
    }
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

  if (lead.email && !isValidEmail(lead.email)) {
    return NextResponse.json({ error: "Проверьте адрес почты" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Слишком много заявок, попробуйте позже" }, { status: 429 });
  }

  const photos = files.length > 0 ? await preparePhotos(files) : [];
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
      await sendToEmail(lead, photos);
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
