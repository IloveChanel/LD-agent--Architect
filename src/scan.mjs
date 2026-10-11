import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function listFiles(dir, root, files) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await listFiles(full, root, files);
    else files.push(path.relative(root, full));
  }
}

export async function scan(dir) {
  const root = path.resolve(dir);
  const files = [];
  await listFiles(root, root, files);
  let dependencies = [];
  try {
    const raw = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    dependencies = Object.keys(raw.dependencies || {});
  } catch {
    dependencies = [];
  }
  return { files, dependencies, github: process.env.GITHUB_TOKEN ? "saved" : "placeholder" };
}

export function review(map, notes = "") {
  const files = map.files || [];
  const convert = /convert|expo|to mobile/.test(notes.toLowerCase());
  const next = convert ? "Target Platform" : files.length ? "Wiring" : "Agent Scope";
  const prompt = convert
    ? "Convert this web project into a phone app. Recycle the existing page names. Scaffold an Expo screen stack. Leave EXPO_TOKEN as PLACEHOLDER."
    : "Read the file map and do only the next missing step. Do not reread source files.";
  return {
    health: files.length ? `${files.length} files. No source was read.` : "The map is empty.",
    next,
    prompt,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] || ".";
  const notes = process.argv.slice(3).join(" ");
  const map = await scan(dir);
  console.log(JSON.stringify({ ...map, ...review(map, notes) }, null, 2));
}
