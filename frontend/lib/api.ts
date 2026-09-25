export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type ValidationDetail = { msg?: unknown };
type ApiErrorPayload = { detail?: unknown };

export function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const detail = (payload as ApiErrorPayload).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .filter((item): item is ValidationDetail => Boolean(item && typeof item === "object"))
      .map((item) => (typeof item.msg === "string" ? item.msg : ""))
      .filter(Boolean);
    if (messages.length > 0) return messages.join(", ");
  }

  return fallback;
}
