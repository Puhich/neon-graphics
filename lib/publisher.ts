import { promises as fs } from "node:fs";
import path from "node:path";

import { canPublishToGithub, githubBranch, githubRepo, githubToken } from "@/lib/env";

// Публикация = коммит в GitHub, после которого Vercel сам пересобирает сайт.
// Локально (без токена) те же файлы просто пишутся на диск, чтобы админку
// можно было гонять без интернета и без риска задеть прод.

export type FileChange = {
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
};

export type CommitResult = {
  mode: "github" | "fs";
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

  if (canPublishToGithub) {
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
export async function recentCommits(limit = 5): Promise<{ message: string; date: string; url: string }[]> {
  if (!canPublishToGithub) {
    return [];
  }

  try {
    const commits = await github<
      { commit: { message: string; author: { date: string } }; html_url: string }[]
    >(`/commits?sha=${githubBranch}&per_page=${limit}`);

    return commits.map((item) => ({
      message: item.commit.message.split("\n")[0],
      date: item.commit.author.date,
      url: item.html_url
    }));
  } catch {
    return [];
  }
}
