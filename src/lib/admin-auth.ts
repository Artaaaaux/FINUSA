import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "finusa_admin_session";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "finusa-dev-secret";
}

function base64(input: string) {
  return Buffer.from(input).toString("base64url");
}

function unbase64(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createAdminToken(username: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `${username}.${exp}`;
  const signature = sign(payload);
  return `${base64(payload)}.${signature}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const payload = unbase64(encodedPayload);
  const expected = sign(payload);

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  const [username, expRaw] = payload.split(".");
  const exp = Number(expRaw);
  if (!username || !exp || Date.now() > exp) return false;

  return username === process.env.ADMIN_USERNAME;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
