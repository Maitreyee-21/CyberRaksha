import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
}

function getDatabaseFilePath(): string {
  // 1. Check frontend/data/cyberraksha.json if process.cwd() is project root
  const rootFrontendFile = path.join(process.cwd(), 'frontend', 'data', 'cyberraksha.json');
  if (fs.existsSync(rootFrontendFile)) {
    return rootFrontendFile;
  }

  // 2. Check data/cyberraksha.json if process.cwd() is frontend
  const cwdFile = path.join(process.cwd(), 'data', 'cyberraksha.json');
  if (fs.existsSync(cwdFile)) {
    return cwdFile;
  }

  // 3. Fallback: if 'frontend' directory exists in cwd, use frontend/data/cyberraksha.json
  if (fs.existsSync(path.join(process.cwd(), 'frontend'))) {
    return rootFrontendFile;
  }

  return cwdFile;
}

function ensureDatabase(): DatabaseSchema {
  const dbFile = getDatabaseFilePath();
  const dataDir = path.dirname(dbFile);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbFile)) {
    const initialData: DatabaseSchema = { users: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !Array.isArray(parsed.users)) {
      parsed.users = [];
    }
    return parsed;
  } catch {
    const initialData: DatabaseSchema = { users: [] };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  const dbFile = getDatabaseFilePath();
  const dataDir = path.dirname(dbFile);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const db = ensureDatabase();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const db = ensureDatabase();
  const normalized = username.trim().toLowerCase();
  return db.users.find((u) => u.username.toLowerCase() === normalized) || null;
}

export async function findUsersByIdentifier(identifier: string): Promise<UserRecord[]> {
  const db = ensureDatabase();
  const normalized = identifier.trim().toLowerCase();
  return db.users.filter(
    (u) =>
      u.email.toLowerCase() === normalized ||
      u.username.toLowerCase() === normalized ||
      u.fullName.toLowerCase() === normalized
  );
}

export async function findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
  const matching = await findUsersByIdentifier(identifier);
  return matching.length > 0 ? matching[0] : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const db = ensureDatabase();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(userData: {
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const db = ensureDatabase();
  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    fullName: userData.fullName.trim(),
    email: userData.email.trim().toLowerCase(),
    username: userData.username.trim().toLowerCase(),
    passwordHash: userData.passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const db = ensureDatabase();
  return [...db.users];
}
