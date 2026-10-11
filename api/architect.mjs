import { review } from "../src/scan.mjs";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const projectName = String(body.projectName || "").trim();
  if (!projectName) return Response.json({ ok: false, error: "Project name is required." });
  const map = { files: Array.isArray(body.files) ? body.files : [], dependencies: Array.isArray(body.dependencies) ? body.dependencies : [] };
  return Response.json({ ok: true, projectName, ...review(map, String(body.notes || "")) });
}
