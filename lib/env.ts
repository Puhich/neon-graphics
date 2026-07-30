// Все секреты живут в переменных окружения. Локально админка должна
// работать и без них — тогда используются dev-значения, а публикация
// пишет файлы прямо на диск вместо коммита в GitHub.

export const isDev = process.env.NODE_ENV !== "production";

export const adminLogin = process.env.ADMIN_LOGIN ?? (isDev ? "admin" : "");
export const adminPassword = process.env.ADMIN_PASSWORD ?? (isDev ? "admin" : "");

export const sessionSecret =
  process.env.SESSION_SECRET ?? (isDev ? "dev-session-secret-change-me-please" : "");

export const githubToken = process.env.GITHUB_TOKEN ?? "";
export const githubRepo = process.env.GITHUB_REPO ?? "Puhich/neon-graphics";
export const githubBranch = process.env.GITHUB_BRANCH ?? "main";

export const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ?? "";
export const telegramChatId = process.env.TELEGRAM_CHAT_ID ?? "";

export const smtp = {
  host: process.env.SMTP_HOST ?? "",
  port: Number(process.env.SMTP_PORT ?? 465),
  user: process.env.SMTP_USER ?? "",
  password: process.env.SMTP_PASSWORD ?? "",
  from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "",
  to: process.env.SMTP_TO ?? ""
};

// Публикация через GitHub возможна только с токеном; без него (локально)
// работает запись на диск.
export const canPublishToGithub = Boolean(githubToken && githubRepo);
export const isAuthConfigured = Boolean(adminLogin && adminPassword && sessionSecret);
