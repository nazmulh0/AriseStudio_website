import { createHash } from "node:crypto";
import { getDatabase } from "./turso";

export class SubmissionError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export async function limitSubmission(req: Request, scope: string, email?: string): Promise<void> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous";
  const identity = email ? `email:${email.toLowerCase()}` : `ip:${ip}`;
  const key = `${scope}:${createHash("sha256").update(identity).digest("hex")}`;
  const now = Date.now(), expires = now + (email ? 3600000 : 600000), limit = email ? 2 : 5;
  const database = await getDatabase();
  const result = await database.batch([
    { sql: "DELETE FROM submission_limits WHERE expires <= ?", args: [now] },
    {
      sql: `INSERT INTO submission_limits (key, count, expires)
        SELECT ?, 1, ? WHERE EXISTS (SELECT 1 FROM submission_limits WHERE key = ?) OR (SELECT count(*) FROM submission_limits) < 10000
        ON CONFLICT(key) DO UPDATE SET count = submission_limits.count + 1
        WHERE submission_limits.count < ? RETURNING count`,
      args: [key, expires, key, limit],
    },
  ], "write");
  if (!result[1].rows.length) throw new SubmissionError("Too many requests. Please try again later.", 429);
}

export async function readSubmission(req: Request, fields: Record<string, { max: number; min?: number }>): Promise<Record<string, string>> {
  const reader = req.body?.getReader();
  if (!reader) throw new SubmissionError("A JSON request body is required.");
  const decoder = new TextDecoder();
  let text = "", size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) {
        await reader.cancel();
        throw new SubmissionError("Request is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { reader.releaseLock(); }
  let body: unknown;
  try { body = JSON.parse(text); } catch { throw new SubmissionError("Invalid JSON request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new SubmissionError("A JSON object is required.");
  const result: Record<string, string> = {};
  for (const [field, { min = 0, max }] of Object.entries(fields)) {
    const value: unknown = Object.getOwnPropertyDescriptor(body, field)?.value;
    if (value !== undefined && typeof value !== "string") throw new SubmissionError(`${field} must be text.`);
    const cleaned = typeof value === "string" ? value.trim() : "";
    if (cleaned.length < min || cleaned.length > max) throw new SubmissionError(`${field} must contain ${min} to ${max} characters.`);
    result[field] = cleaned;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new SubmissionError("A valid email address is required.");
  return result;
}
