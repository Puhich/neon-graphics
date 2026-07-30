import { NextResponse } from "next/server";

import { checkCredentials, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/env";

export async function POST(request: Request) {
  if (!isAuthConfigured) {
    return NextResponse.json(
      { error: "Админка не настроена: не заданы ADMIN_LOGIN, ADMIN_PASSWORD и SESSION_SECRET." },
      { status: 500 }
    );
  }

  let login = "";
  let password = "";

  try {
    const body = (await request.json()) as { login?: string; password?: string };
    login = body.login?.trim() ?? "";
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  if (!checkCredentials(login, password)) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(login), sessionCookieOptions);

  return response;
}
