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
  // 1. If cwd is project root (contains frontend directory)
  const rootFrontendFile = path.join(process.cwd(), 'frontend', 'data', 'cyberraksha.json');
  if (fs.existsSync(path.join(process.cwd(), 'frontend', 'data'))) {
    return rootFrontendFile;
  }

  // 2. If cwd is already frontend
  const cwdFile = path.join(process.cwd(), 'data', 'cyberraksha.json');
  if (fs.existsSync(path.join(process.cwd(), 'data'))) {
    return cwdFile;
  }

  // 3. Check if frontend directory exists in cwd
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

  const tmpFile = `${dbFile}.${Date.now()}.${Math.random().toString(36).slice(2, 7)}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, dbFile);
  } catch {
    // Fallback direct write if atomic rename fails on Windows file locks
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {
      // ignore
    }
  }
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
  
  // Prioritize exact email or username match first
  const exactMatches = db.users.filter(
    (u) => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized
  );
  if (exactMatches.length > 0) {
    return exactMatches;
  }

  // Fall back to full name match
  return db.users.filter((u) => u.fullName.toLowerCase() === normalized);
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
  const emailNorm = userData.email.trim().toLowerCase();
  const usernameNorm = userData.username.trim().toLowerCase();

  // Enforce unique constraints at database level
  const existingEmail = db.users.find((u) => u.email.toLowerCase() === emailNorm);
  if (existingEmail) {
    throw new Error('DUPLICATE_EMAIL: An account with this email already exists.');
  }

  const existingUsername = db.users.find((u) => u.username.toLowerCase() === usernameNorm);
  if (existingUsername) {
    throw new Error('DUPLICATE_USERNAME: This username is already taken. Please choose another.');
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    fullName: userData.fullName.trim(),
    email: emailNorm,
    username: usernameNorm,
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

