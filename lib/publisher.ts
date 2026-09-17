import { promises as fs } from "node:fs";
import path from "node:path";

import { canPublishToGithub, githubBranch, githubRepo, githubToken, isSelfHosted } from "@/lib/env";

// Публикация = коммит в GitHub, после которого Vercel сам пересобирает сайт.
// Локально (без токена) те же файлы просто пишутся на диск, чтобы админку
// можно было гонять без интернета и без риска задеть прод.

export type FileChange = {
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
};

export type CommitResult = {
  mode: "github" | "fs" | "both";
  url?: string;
};

const API = "https://api.github.com";

async function github<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}/repos/${githubRepo}${endpoint}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const details = await response.text();

    throw new Error(`GitHub API ${response.status}: ${details.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

async function writeToDisk(files: FileChange[]): Promise<void> {
  for (const file of files) {
    const target = path.join(process.cwd(), file.path);
    await fs.mkdir(path.dirname(target), { recursive: true });

    if (file.encoding === "base64") {
      await fs.writeFile(target, Buffer.from(file.content, "base64"));
    } else {
      await fs.writeFile(target, file.content, "utf-8");
    }
  }
}

// Один коммит на все файлы сразу: создаём блобы, дерево, коммит и двигаем
// ветку. Так публикация атомарна — сайт не увидит половину изменений.
export async function commitFiles(files: FileChange[], message: string): Promise<CommitResult> {
  if (!canPublishToGithub) {
    await writeToDisk(files);

    return { mode: "fs" };
  }

  // На своём сервере сначала коммит (источник правды и бэкап), потом диск —
  // если GitHub недоступен, сайт не разойдётся с репозиторием.
  if (isSelfHosted) {
    const result = await commitToGithub(files, message);
    await writeToDisk(files);

    return { mode: "both", url: result.url };
  }

  return commitToGithub(files, message);
}

async function commitToGithub(files: FileChange[], message: string): Promise<CommitResult> {
  const ref = await github<{ object: { sha: string } }>(`/git/ref/heads/${githubBranch}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await github<{ tree: { sha: string } }>(`/git/commits/${baseCommitSha}`);

  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await github<{ sha: string }>("/git/blobs", {
        method: "POST",
        body: JSON.stringify({
          content: file.content,
          encoding: file.encoding === "base64" ? "base64" : "utf-8"
        })
      });

      return { path: file.path, sha: blob.sha };
    })
  );

  const tree = await github<{ sha: string }>("/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseCommit.tree.sha,
      tree: blobs.map((blob) => ({
        path: blob.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      }))
    })
  });

  const commit = await github<{ sha: string; html_url: string }>("/git/commits", {
    method: "POST",
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [baseCommitSha]
    })
  });

  await github(`/git/refs/heads/${githubBranch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha })
  });

  return { mode: "github", url: commit.html_url };
}

// Файл из репозитория: нужен админке, чтобы показать превью только что
// загруженной картинки, которой ещё нет на живом сайте.
export async function readRepoFile(filePath: string): Promise<Buffer | null> {
  const relative = filePath.replace(/^\/+/, "");

  if (canPublishToGithub && !isSelfHosted) {
    const response = await fetch(
      `${API}/repos/${githubRepo}/contents/${encodeURI(relative)}?ref=${githubBranch}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/vnd.github.raw",
          Authorization: `Bearer ${githubToken}`
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    return Buffer.from(await response.arrayBuffer());
  }

  try {
    return await fs.readFile(path.join(process.cwd(), relative));
  } catch {
    return null;
  }
}

// Последние коммиты — история публикаций для дашборда.
// Для старых записей с общим сообщением разделы вычисляются задним числом:
// сравниваем content.json коммита с родительским. Результат кэшируется по sha.
const historyLabels = new Map<string, string>();

async function contentAt(sha: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(`${API}/repos/${githubRepo}/contents/data/content.json?ref=${sha}`, {
    cache: "no-store",
    headers: { Accept: "application/vnd.github.raw", Authorization: `Bearer ${githubToken}` }
  });

  return response.ok ? ((await response.json()) as Record<string, unknown>) : null;
}

export function describeChanges(
  before: Record<string, unknown> | null,
  after: Record<string, unknown>,
  titles: Record<string, string>
): string {
  if (!before) return "Публикация из админки";
  const changed = Object.keys(after)
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
    .map((key) => titles[key] ?? key);

  return changed.length > 0 ? `Изменено: ${changed.join(", ")}` : "Публикация без изменений";
}

export async function recentCommits(
  limit = 5,
  titles: Record<string, string> = {}
): Promise<{ message: string; date: string; url: string }[]> {
  if (!canPublishToGithub) {
    return [];
  }

  try {
    // Только публикации из админки — их узнаём по тексту сообщения.
    // Правки кода разработчиком клиенту не нужны.
    const commits = await github<
      { sha: string; parents: { sha: string }[]; commit: { message: string; author: { date: string } }; html_url: string }[]
    >(`/commits?sha=${githubBranch}&path=data/content.json&per_page=40`);

    const own = commits
      .filter((item) => /^(Изменено:|Публикация|Обновление контента сайта через админку)/.test(item.commit.message))
      .slice(0, limit);

    return Promise.all(
      own.map(async (item) => {
        let message = item.commit.message.split("\n")[0];

        if (message.startsWith("Обновление контента")) {
          const cached = historyLabels.get(item.sha);
          if (cached) {
            message = cached;
          } else {
            try {
              const [after, before] = await Promise.all([
                contentAt(item.sha),
                item.parents[0] ? contentAt(item.parents[0].sha) : Promise.resolve(null)
              ]);
              if (after) {
                message = describeChanges(before, after, titles);
                historyLabels.set(item.sha, message);
              }
            } catch {
              // Оставляем исходное сообщение.
            }
          }
        }

        return { message, date: item.commit.author.date, url: item.html_url };
      })
    );
  } catch {
    return [];
  }
}
