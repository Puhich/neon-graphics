import { NextResponse } from "next/server";

import {
  canPublishToGithub,
  githubBranch,
  githubRepo,
  isDev,
  smtp,
  telegramBotToken,
  telegramChatId
} from "@/lib/env";
import { recentCommits } from "@/lib/publisher";

export const runtime = "nodejs";

// Никаких значений секретов наружу — только «настроено / не настроено».
export async function GET() {
  return NextResponse.json({
    isDev,
    publish: {
      configured: canPublishToGithub,
      repo: canPublishToGithub ? githubRepo : null,
      branch: githubBranch
    },
    telegram: { configured: Boolean(telegramBotToken && telegramChatId) },
    email: { configured: Boolean(smtp.host && smtp.user && smtp.password && smtp.to) },
    history: await recentCommits(5)
  });
}
