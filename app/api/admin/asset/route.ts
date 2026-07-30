import { NextResponse } from "next/server";

import { readRepoFile } from "@/lib/publisher";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  gif: "image/gif",
  ico: "image/x-icon"
};

// Превью картинки, которая уже загружена в репозиторий, но ещё не попала на
// живой сайт (деплой происходит только при публикации).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assetPath = searchParams.get("path") ?? "";

  if (!assetPath.startsWith("/") || assetPath.includes("..")) {
    return NextResponse.json({ error: "Некорректный путь" }, { status: 400 });
  }

  const file = await readRepoFile(`public${assetPath}`);

  if (!file) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }

  const extension = assetPath.split(".").pop()?.toLowerCase() ?? "";

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": MIME[extension] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60"
    }
  });
}
