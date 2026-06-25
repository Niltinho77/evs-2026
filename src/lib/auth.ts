export type UserRole = "admin" | "common";

export type AuthSession = {
  username: string;
  role: UserRole;
  expiresAt: number;
};

export const SESSION_COOKIE = "evs_session";

const USERS: Record<string, { password: string; role: UserRole; label: string }> = {
  caveirinha: { password: "Brasil@2026", role: "common", label: "Caveirinha" },
  admin: { password: "sgte", role: "admin", label: "Admin" },
};

function authSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-troque-isso-depois";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function validateCredentials(usernameRaw: string, password: string) {
  const username = usernameRaw.trim().toLowerCase();
  const user = USERS[username];
  if (!user || user.password !== password) return null;
  return { username, role: user.role, label: user.label };
}

export async function createSessionToken(username: string, role: UserRole) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  const payload = `${username}.${role}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<AuthSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [username, role, expiresAtRaw, signature] = parts;
  if (role !== "admin" && role !== "common") return null;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const payload = `${username}.${role}.${expiresAtRaw}`;
  const expected = await sign(payload);
  if (!safeEqual(signature, expected)) return null;
  return { username, role, expiresAt };
}

export function isAdmin(session: AuthSession | null) {
  return session?.role === "admin";
}

export async function getSessionFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  const token = match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : null;
  return verifySessionToken(token);
}

const MASK = "********";

export function maskForCommon<T extends Record<string, unknown>>(soldier: T): T {
  const masked = { ...soldier };

  const textFields = [
    "cpf",
    "idt",
    "phone",
    "emergencyPhone",
    "naturalidade",
    "motherName",
    "fatherName",
    "address",
    "familyHistory",
    "professionalExp",
    "bank",
    "agency",
    "account",
    "religion",
    "voterTitle",
    "facebook",
    "instagram",
    "healthIssues",
    "girlfriendAddress",
    "drugsDetails",
    "tattoos",
    "arrestDetails",
    "livesWithWhom",
    "lostWhoCause",
    "livedAwayWhere",
    "policeProblemsDetails",
    "accidentSequelaeDetails",
    "surgeriesDetails",
    "stdDetails",
    "mentalSymptomsDetails",
    "irritabilityAnxietyEtcDetails",
    "militaryRelativeDetails",
    "relationshipFather",
    "relationshipMother",
    "relationshipSiblings",
    "workDetails",
    "identidadeMilitar",
  ];

  for (const field of textFields) {
    if (field in masked) masked[field as keyof T] = MASK as T[keyof T];
  }

  const numericFields = [
    "childrenCount",
    "householdCount",
    "familyIncome",
    "helpsFamilyAmount",
    "siblingsCount",
    "workSalary",
  ];
  for (const field of numericFields) {
    if (field in masked) masked[field as keyof T] = null as T[keyof T];
  }

  const booleanFields = [
    "hasGirlfriend",
    "hasBeenArrested",
    "lostCloseFamily",
    "policeProblems",
    "accidentSequelae",
    "hadSurgeries",
    "hasSTDs",
    "hasSeizuresFainting",
    "mentalSymptoms",
    "suddenFear",
    "irritabilityAnxietyEtc",
    "hasMilitaryRelative",
    "helpsFamily",
    "smoker",
    "alcoholUse",
  ];
  for (const field of booleanFields) {
    if (field in masked) masked[field as keyof T] = false as T[keyof T];
  }

  return masked;
}
