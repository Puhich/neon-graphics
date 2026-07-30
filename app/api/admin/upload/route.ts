import { NextResponse } from "next/server";
import sharp from "sharp";

import { commitFiles, type FileChange } from "@/lib/publisher";

export const runtime = "nodejs";
export const maxDuration = 60;

// Клиент загружает что угодно (хоть 12 МБ с телефона) — сервер сам жмёт и
// раскладывает варианты, которые ждёт кастомный лоадер картинок.

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya"
};

function slugify(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").toLowerCase();
  const latin = base
    .split("")
    .map((char) => TRANSLIT[char] ?? char)
    .join("");
  const clean = latin.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);

  return `${clean || "file"}-${suffix}`;
}

type UploadKind = "photo" | "logo" | "brand" | "og" | "favicon";

async function buildFiles(kind: UploadKind, buffer: Buffer, slug: string): Promise<{ files: FileChange[]; src: string }> {
  const image = sharp(buffer, { animated: false }).rotate();

  if (kind === "photo") {
    // Три файла на каждое фото: база ≤1400px и варианты под лоадер.
    const [base, small, medium] = await Promise.all([
      image.clone().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer(),
      image.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 77 }).toBuffer(),
      image.clone().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 77 }).toBuffer()
    ]);

    return {
      src: `/images/${slug}.webp`,
      files: [
        { path: `public/images/${slug}.webp`, content: base.toString("base64"), encoding: "base64" },
        { path: `public/images/${slug}-640.webp`, content: small.toString("base64"), encoding: "base64" },
        { path: `public/images/${slug}-1280.webp`, content: medium.toString("base64"), encoding: "base64" }
      ]
    };
  }

  if (kind === "logo") {
    const logo = await image.resize({ width: 480, height: 240, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();

    return {
      src: `/logos/${slug}.webp`,
      files: [{ path: `public/logos/${slug}.webp`, content: logo.toString("base64"), encoding: "base64" }]
    };
  }

  if (kind === "brand") {
    const logo = await image.resize({ width: 720, withoutEnlargement: true }).webp({ quality: 92 }).toBuffer();

    return {
      src: `/brand/${slug}.webp`,
      files: [{ path: `public/brand/${slug}.webp`, content: logo.toString("base64"), encoding: "base64" }]
    };
  }

  if (kind === "og") {
    // Превью ссылки в мессенджерах: фиксированные 1200×630 и jpeg ради
    // максимальной совместимости.
    const og = await image
      .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
      .jpeg({ quality: 86 })
      .toBuffer();

    return {
      src: `/og/${slug}.jpg`,
      files: [{ path: `public/og/${slug}.jpg`, content: og.toString("base64"), encoding: "base64" }]
    };
  }

  const [icon, appleIcon] = await Promise.all([
    image.clone().resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
    image.clone().resize({ width: 180, height: 180, fit: "contain", background: { r: 15, g: 15, b: 13, alpha: 1 } }).png().toBuffer()
  ]);

  return {
    src: "/icon.png",
    files: [
      { path: "public/icon.png", content: icon.toString("base64"), encoding: "base64" },
      { path: "public/apple-icon.png", content: appleIcon.toString("base64"), encoding: "base64" }
    ]
  };
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать файл" }, { status: 400 });
  }

  const file = formData.get("file");
  const kind = (formData.get("kind") as UploadKind | null) ?? "photo";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Файл больше 25 МБ" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { files, src } = await buildFiles(kind, buffer, slugify(file.name || "image"));

    // [skip ci] — загрузка картинки не должна запускать пересборку сайта,
    // деплой запускается только кнопкой «Опубликовать».
    const result = await commitFiles(files, `Загрузка изображения ${src} [skip ci]`);

    return NextResponse.json({ ok: true, src, mode: result.mode });
  } catch (error) {
    return NextResponse.json(
      { error: `Не удалось обработать изображение: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
