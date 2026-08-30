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

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cyberraksha.json');

function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = { users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !Array.isArray(parsed.users)) {
      parsed.users = [];
    }
    return parsed;
  } catch {
    const initialData: DatabaseSchema = { users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
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

export async function findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
  const db = ensureDatabase();
  const normalized = identifier.trim().toLowerCase();
  return (
    db.users.find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.username.toLowerCase() === normalized
    ) || null
  );
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
