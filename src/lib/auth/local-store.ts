import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface LocalUserRecord {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  accountStatus: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  phone?: string | null;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

function ensureStore(): LocalUserRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const adminUsername = (process.env.ADMIN_USERNAME ?? "admin").toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@company-name.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";
    const adminFullName = process.env.ADMIN_FULL_NAME ?? "Site Administrator";

    if (!fs.existsSync(DATA_FILE)) {
      const salt = bcrypt.genSaltSync(10);
      const adminHash = bcrypt.hashSync(adminPassword, salt);
      const defaultAdmin: LocalUserRecord = {
        id: "admin-master",
        fullName: adminFullName,
        username: adminUsername,
        email: adminEmail,
        passwordHash: adminHash,
        role: "ADMIN",
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        accountStatus: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify([defaultAdmin], null, 2), "utf8");
      return [defaultAdmin];
    }

    const raw = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
    const users: LocalUserRecord[] = JSON.parse(raw);

    // Ensure default admin exists
    const hasAdmin = users.some(
      (u) =>
        u.username.toLowerCase() === adminUsername ||
        u.email.toLowerCase() === adminEmail
    );

    if (!hasAdmin) {
      const salt = bcrypt.genSaltSync(10);
      const adminHash = bcrypt.hashSync(adminPassword, salt);
      const defaultAdmin: LocalUserRecord = {
        id: "admin-master",
        fullName: adminFullName,
        username: adminUsername,
        email: adminEmail,
        passwordHash: adminHash,
        role: "ADMIN",
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        accountStatus: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(defaultAdmin);
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
    }

    return users;
  } catch (err) {
    console.error("[Local Auth Store Error]", err);
    return [];
  }
}

export function findLocalUser(identifier: string): LocalUserRecord | null {
  const users = ensureStore();
  const idLower = identifier.trim().toLowerCase();
  return (
    users.find(
      (u) =>
        u.username.toLowerCase() === idLower ||
        u.email.toLowerCase() === idLower
    ) ?? null
  );
}

export function saveLocalUser(user: Omit<LocalUserRecord, "id" | "createdAt" | "updatedAt">): LocalUserRecord {
  const users = ensureStore();
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const record: LocalUserRecord = {
    ...user,
    id,
    createdAt: now,
    updatedAt: now,
  };

  users.push(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
  return record;
}

export function getAllLocalUsers(): LocalUserRecord[] {
  return ensureStore();
}

export function getLocalUserById(id: string): LocalUserRecord | null {
  const users = ensureStore();
  return users.find((u) => u.id === id) ?? null;
}

export function updateLocalUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION"
): LocalUserRecord | null {
  const users = ensureStore();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index].accountStatus = status;
  users[index].updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
  return users[index];
}

export function updateLocalUser(
  id: string,
  updates: Partial<Pick<LocalUserRecord, "fullName" | "email" | "phone" | "passwordHash" | "accountStatus">>
): LocalUserRecord | null {
  const users = ensureStore();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
  return users[index];
}
