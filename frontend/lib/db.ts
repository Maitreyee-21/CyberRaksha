import fs from 'fs';
import path from 'path';
import os from 'os';

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

// Global in-memory cache to ensure state persists across warm serverless Lambda invocations
declare global {
  // eslint-disable-next-line no-var
  var __CYBERRAKSHA_MEM_DB__: DatabaseSchema | undefined;
}

// Fallback seed accounts to ensure default access even if filesystem is read-only or empty
const SEED_USERS: UserRecord[] = [
  {
    id: 'usr_1788111990726_47fmj69',
    fullName: 'Aditya Verma',
    email: 'aditya_1788111990522@example.com',
    username: 'aditya_522',
    passwordHash: '$2b$10$FDN1AldRA1.qOlzfq55mKeR6Z1DVQ44PKjqrTObijVzmiCU.vQUdS',
    createdAt: '2026-08-30T17:46:30.726Z',
  },
  {
    id: 'usr_1789229814934_tdjrc93',
    fullName: 'Maitreyee Patel',
    email: 'maitreyee_1789229812613@example.com',
    username: 'maitreyee-21',
    passwordHash: '$2b$10$MbbofQTucW8TfI9kz//8/OMUhVu.aiWq8ColhnFvK5EszMDoXdx2q',
    createdAt: '2026-09-12T16:16:54.934Z',
  },
  {
    id: 'usr_1789230247148_v0lcl2h',
    fullName: 'User',
    email: 'user11@gmail.com',
    username: 'user_11',
    passwordHash: '$2b$10$AU/2cYwjnkz30XW0lxeaD.fJVni6iLxN4QagLM4O4beZTcv0ZIyXS',
    createdAt: '2026-09-12T16:24:07.148Z',
  },
];

function getWritableTmpFilePath(): string {
  try {
    const tmpDir = os.tmpdir() || '/tmp';
    return path.join(tmpDir, 'cyberraksha_db.json');
  } catch {
    return '/tmp/cyberraksha_db.json';
  }
}

function getCandidateBundledPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'cyberraksha.json'),
    path.join(cwd, 'frontend', 'data', 'cyberraksha.json'),
    path.join(__dirname, '..', 'data', 'cyberraksha.json'),
    path.join(__dirname, '..', '..', 'data', 'cyberraksha.json'),
  ];
}

function ensureDatabase(): DatabaseSchema {
  // 1. If already active in memory, return it
  if (globalThis.__CYBERRAKSHA_MEM_DB__ && Array.isArray(globalThis.__CYBERRAKSHA_MEM_DB__.users)) {
    return globalThis.__CYBERRAKSHA_MEM_DB__;
  }

  // 2. Try loading from writable /tmp path first (which might have been saved in a previous serverless invocation)
  const tmpPath = getWritableTmpFilePath();
  try {
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users)) {
        globalThis.__CYBERRAKSHA_MEM_DB__ = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // Continue to bundled files
  }

  // 3. Try loading from static bundled JSON file
  const candidatePaths = getCandidateBundledPaths();
  for (const candidate of candidatePaths) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = fs.readFileSync(candidate, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          globalThis.__CYBERRAKSHA_MEM_DB__ = parsed;
          // Attempt to replicate to /tmp for faster future read/write
          try {
            fs.writeFileSync(tmpPath, JSON.stringify(parsed, null, 2), 'utf-8');
          } catch {
            // Ignore /tmp write failure
          }
          return parsed;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // 4. Fallback to seed accounts
  const fallbackData: DatabaseSchema = { users: [...SEED_USERS] };
  globalThis.__CYBERRAKSHA_MEM_DB__ = fallbackData;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(fallbackData, null, 2), 'utf-8');
  } catch {
    // Ignore /tmp write failure
  }
  return fallbackData;
}

function writeDatabase(data: DatabaseSchema): void {
  // Always update in-memory instance first
  globalThis.__CYBERRAKSHA_MEM_DB__ = data;

  // 1. Write to /tmp (always writable in AWS Lambda / Vercel Serverless)
  try {
    const tmpPath = getWritableTmpFilePath();
    const tmpDir = path.dirname(tmpPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[DB] Tmp disk write warning:', err?.message || err);
  }

  // 2. Also try writing to local project path if in local development
  try {
    const candidatePaths = getCandidateBundledPaths();
    for (const candidate of candidatePaths) {
      const dataDir = path.dirname(candidate);
      if (fs.existsSync(dataDir)) {
        fs.writeFileSync(candidate, JSON.stringify(data, null, 2), 'utf-8');
        break;
      }
    }
  } catch {
    // Expected in Vercel / serverless environments where process.cwd() is read-only.
    // Gracefully bypass without throwing EROFS error.
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
